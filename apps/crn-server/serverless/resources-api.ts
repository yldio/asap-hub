import {
  awsAcmCertificateArn,
  hostname,
  isProd,
  opensearchDomain,
  opensearchDomainName,
  opensearchMasterPassword,
  opensearchMasterUser,
  shouldCreateDomain,
  stage,
} from './shared';

const staticSiteBucket = (
  bucketName: string,
  extraProperties: Record<string, unknown> = {},
) => ({
  Type: 'AWS::S3::Bucket',
  DeletionPolicy: 'Delete',
  Properties: {
    BucketName: bucketName,
    OwnershipControls: {
      Rules: [
        {
          ObjectOwnership: 'BucketOwnerPreferred',
        },
      ],
    },
    PublicAccessBlockConfiguration: {
      BlockPublicPolicy: false,
      BlockPublicAcls: false,
      IgnorePublicAcls: false,
      RestrictPublicBuckets: false,
    },
    CorsConfiguration: {
      CorsRules: [
        {
          AllowedMethods: ['GET', 'HEAD'],
          AllowedHeaders: ['*'],
          AllowedOrigins: ['*'],
          MaxAge: 3000,
        },
      ],
    },
    ...extraProperties,
  },
});

const publicReadBucketPolicy = (
  bucketLogicalId: string,
  bucketName: string,
) => ({
  Type: 'AWS::S3::BucketPolicy',
  Properties: {
    Bucket: bucketName,
    PolicyDocument: {
      Statement: [
        {
          Action: ['s3:GetObject'],
          Effect: 'Allow',
          Principal: '*',
          Resource: {
            'Fn::Join': [
              '',
              [{ 'Fn::GetAtt': [bucketLogicalId, 'Arn'] }, '/*'],
            ],
          },
        },
        {
          Action: ['s3:ListBucket'],
          Effect: 'Allow',
          Principal: '*',
          Resource: { 'Fn::GetAtt': [bucketLogicalId, 'Arn'] },
        },
      ],
    },
  },
});

const retainedBackupBucket = (bucketName: string) => ({
  Type: 'AWS::S3::Bucket',
  Condition: 'IsDevOrProd',
  DeletionPolicy: 'Retain',
  Properties: {
    BucketName: bucketName,
    LifecycleConfiguration: {
      Rules: [
        {
          Id: 'delete-after-3-months',
          Status: 'Enabled',
          ExpirationInDays: 90,
        },
      ],
    },
  },
});

export const conditions = {
  IsDev: {
    'Fn::Equals': ['${self:provider.stage}', 'dev'],
  },
  IsProd: {
    'Fn::Equals': ['${self:provider.stage}', 'production'],
  },
  IsDevOrProd: {
    'Fn::Or': [
      {
        Condition: 'IsDev',
      },
      {
        Condition: 'IsProd',
      },
    ],
  },
};

export const apiResources = {
  HttpApiDomain: {
    Type: 'AWS::ApiGatewayV2::DomainName',
    Properties: {
      DomainName: '${self:custom.apiHostname}',
      DomainNameConfigurations: [
        {
          CertificateArn: awsAcmCertificateArn,
          EndpointType: 'REGIONAL',
        },
      ],
    },
  },
  HttpApiApiMapping: {
    Type: 'AWS::ApiGatewayV2::ApiMapping',
    DependsOn: ['HttpApiDomain'],
    Properties: {
      ApiId: { Ref: 'HttpApi' },
      ApiMappingKey: '',
      DomainName: '${self:custom.apiHostname}',
      Stage: { Ref: 'HttpApiStage' },
    },
  },
  HttpApiRecordSetGroup: {
    Type: 'AWS::Route53::RecordSetGroup',
    Properties: {
      HostedZoneName: `${hostname}.`,
      RecordSets: [
        {
          Name: '${self:custom.apiHostname}',
          Type: 'A',
          AliasTarget: {
            DNSName: {
              'Fn::GetAtt': ['HttpApiDomain', 'RegionalDomainName'],
            },
            HostedZoneId: {
              'Fn::GetAtt': ['HttpApiDomain', 'RegionalHostedZoneId'],
            },
          },
        },
      ],
    },
  },
  HttpApiStage: {
    Type: 'AWS::ApiGatewayV2::Stage',
    DependsOn: ['HttpApiRouteGetPublicProxyVar'],
    Properties: {
      RouteSettings: {
        'GET /public/{proxy+}': {
          ThrottlingBurstLimit: 50,
          ThrottlingRateLimit: 30,
        },
      },
    },
  },
  FilesBucket: {
    Type: 'AWS::S3::Bucket',
    DeletionPolicy: 'Delete',
    Properties: {
      BucketName: '${self:service}-${self:provider.stage}-files',
      OwnershipControls: {
        Rules: [
          {
            ObjectOwnership: 'BucketOwnerPreferred',
          },
        ],
      },
      PublicAccessBlockConfiguration: {
        BlockPublicPolicy: false,
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        RestrictPublicBuckets: false,
      },
      CorsConfiguration: {
        // allows PUT requests from the app frontend
        CorsRules: [
          {
            AllowedOrigins:
              stage === 'local'
                ? [
                    'https://${self:custom.appHostname}',
                    'http://localhost:3000',
                    'http://127.0.0.1:3000',
                  ]
                : ['https://${self:custom.appHostname}'],
            AllowedMethods: ['PUT'],
            AllowedHeaders: ['*'],
            ExposedHeaders: ['ETag'],
            MaxAge: 3000,
          },
        ],
      },
      LifecycleConfiguration: {
        Rules: [
          {
            Id: 'AutoDeleteAfter24Hours',
            Status: 'Enabled',
            ExpirationInDays: 1,
          },
        ],
      },
    },
  },
  BucketPolicyFiles: {
    Type: 'AWS::S3::BucketPolicy',
    Properties: {
      Bucket: '${self:service}-${self:provider.stage}-files',
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AllowPublicRead',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:aws:s3:::',
                  '${self:service}-${self:provider.stage}-files',
                  '/*',
                ],
              ],
            },
          },
        ],
      },
    },
  },
  FrontendBucket: staticSiteBucket(
    '${self:service}-${self:provider.stage}-frontend',
  ),
  AuthFrontendBucket: staticSiteBucket(
    '${self:service}-${self:provider.stage}-auth-frontend',
  ),
  StorybookBucket: staticSiteBucket(
    '${self:service}-${self:provider.stage}-storybook',
    {
      WebsiteConfiguration: {
        IndexDocument: 'index.html',
      },
    },
  ),
  MessagesStaticBucket: staticSiteBucket(
    '${self:service}-${self:provider.stage}-messages-static',
  ),
  BucketPolicyFrontend: publicReadBucketPolicy(
    'FrontendBucket',
    '${self:service}-${self:provider.stage}-frontend',
  ),
  BucketPolicyAuthFrontend: publicReadBucketPolicy(
    'AuthFrontendBucket',
    '${self:service}-${self:provider.stage}-auth-frontend',
  ),
  BucketPolicyStorybook: publicReadBucketPolicy(
    'StorybookBucket',
    '${self:service}-${self:provider.stage}-storybook',
  ),
  BucketPolicyMessagesStatic: publicReadBucketPolicy(
    'MessagesStaticBucket',
    '${self:service}-${self:provider.stage}-messages-static',
  ),
  DataBackupBucket: retainedBackupBucket(
    '${self:service}-${self:provider.stage}-data-backup',
  ),
  ContentfulBackupBucket: retainedBackupBucket(
    '${self:service}-${self:provider.stage}-contentful-backup',
  ),
  CloudFrontOriginAccessIdentityFrontend: {
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    Properties: {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: { Ref: 'FrontendBucket' },
      },
    },
  },
  CloudFrontOriginAccessIdentityAuthFrontend: {
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    Properties: {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: { Ref: 'AuthFrontendBucket' },
      },
    },
  },
  CloudFrontOriginAccessIdentityStorybook: {
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    Properties: {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: { Ref: 'StorybookBucket' },
      },
    },
  },
  CloudFrontOriginAccessIdentityMessagesStatic: {
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    Properties: {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: { Ref: 'MessagesStaticBucket' },
      },
    },
  },
  CloudFrontDistribution: {
    Type: 'AWS::CloudFront::Distribution',
    DependsOn: [
      'FrontendBucket',
      'AuthFrontendBucket',
      'StorybookBucket',
      'MessagesStaticBucket',
    ],
    Properties: {
      DistributionConfig: {
        Aliases: ['${self:custom.appHostname}'],
        CustomErrorResponses: [
          {
            ErrorCode: 404,
            ResponseCode: 200,
            ResponsePagePath: '/index.html',
          },
        ],
        Origins: [
          {
            DomainName: {
              'Fn::GetAtt': ['FrontendBucket', 'RegionalDomainName'],
            },
            Id: 's3origin-frontend',
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Join': [
                  '/',
                  [
                    'origin-access-identity/cloudfront',
                    { Ref: 'CloudFrontOriginAccessIdentityFrontend' },
                  ],
                ],
              },
            },
          },
          {
            DomainName: {
              'Fn::GetAtt': ['AuthFrontendBucket', 'RegionalDomainName'],
            },
            Id: 's3origin-auth-frontend',
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Join': [
                  '/',
                  [
                    'origin-access-identity/cloudfront',
                    { Ref: 'CloudFrontOriginAccessIdentityAuthFrontend' },
                  ],
                ],
              },
            },
          },
          {
            CustomOriginConfig: {
              OriginProtocolPolicy: 'http-only',
            },
            DomainName: {
              'Fn::Select': [
                '1',
                {
                  'Fn::Split': [
                    'http://',
                    {
                      'Fn::GetAtt': ['StorybookBucket', 'WebsiteURL'],
                    },
                  ],
                },
              ],
            },
            Id: 's3origin-storybook',
          },
          {
            DomainName: {
              'Fn::GetAtt': ['MessagesStaticBucket', 'RegionalDomainName'],
            },
            Id: 's3origin-messages-static',
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Join': [
                  '/',
                  [
                    'origin-access-identity/cloudfront',
                    { Ref: 'CloudFrontOriginAccessIdentityAuthFrontend' },
                  ],
                ],
              },
            },
          },
          {
            CustomOriginConfig: {
              OriginProtocolPolicy: 'https-only',
            },
            DomainName: {
              'Fn::Join': [
                '.',
                [
                  { Ref: 'HttpApi' },
                  'execute-api',
                  { Ref: 'AWS::Region' },
                  { Ref: 'AWS::URLSuffix' },
                ],
              ],
            },
            Id: 'apigw',
          },
        ],
        DefaultCacheBehavior: {
          AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
          CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
          Compress: true,
          DefaultTTL: 3600,
          ForwardedValues: {
            Cookies: {
              Forward: 'none',
            },
            QueryString: false,
          },
          TargetOriginId: 's3origin-frontend',
          ViewerProtocolPolicy: 'redirect-to-https',
        },
        CacheBehaviors: [
          {
            AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
            CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
            Compress: true,
            DefaultTTL: 3600,
            ForwardedValues: {
              Cookies: {
                Forward: 'none',
              },
              QueryString: false,
            },
            PathPattern: '.auth/*',
            TargetOriginId: 's3origin-auth-frontend',
            ViewerProtocolPolicy: 'redirect-to-https',
          },
          {
            AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
            CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
            Compress: true,
            DefaultTTL: 3600,
            ForwardedValues: {
              Cookies: {
                Forward: 'none',
              },
              QueryString: true,
            },
            PathPattern: '.storybook/*',
            TargetOriginId: 's3origin-storybook',
            ViewerProtocolPolicy: 'redirect-to-https',
          },
          {
            AllowedMethods: ['GET', 'HEAD', 'OPTIONS'],
            CachedMethods: ['GET', 'HEAD', 'OPTIONS'],
            Compress: true,
            DefaultTTL: 3600,
            ForwardedValues: {
              Cookies: {
                Forward: 'none',
              },
              QueryString: false,
            },
            PathPattern: '.messages-static/*',
            TargetOriginId: 's3origin-messages-static',
            ViewerProtocolPolicy: 'redirect-to-https',
          },
        ],
        DefaultRootObject: 'index.html',
        Enabled: true,
        PriceClass: 'PriceClass_100',
        ViewerCertificate: {
          AcmCertificateArn: awsAcmCertificateArn,
          MinimumProtocolVersion: 'TLSv1.2_2018',
          SslSupportMethod: 'sni-only',
        },
      },
    },
  },
  CloudFrontRecordSetGroup: {
    Type: 'AWS::Route53::RecordSetGroup',
    Properties: {
      HostedZoneName: `${hostname}.`,
      RecordSets: [
        {
          Name: '${self:custom.appHostname}',
          Type: 'A',
          AliasTarget: {
            DNSName: {
              'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
            },
            // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-hostedzoneid
            HostedZoneId: 'Z2FDTNDATAQYW2',
          },
        },
      ],
    },
  },
  // Queue names below are a cross-service contract: serverless-async.ts
  // references them via constructed ARNs/URLs. Do not rename.
  ContentfulPollerQueue: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName:
        '${self:service}-${self:provider.stage}-contentful-poller-queue',
      RedrivePolicy: {
        maxReceiveCount: 5,
        deadLetterTargetArn: {
          'Fn::GetAtt': ['ContentfulPollerQueueDLQ', 'Arn'],
        },
      },
    },
  },
  ContentfulPollerQueueDLQ: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName:
        '${self:service}-${self:provider.stage}-contentful-poller-queue-dlq',
    },
  },
  GoogleCalendarEventQueue: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName:
        '${self:service}-${self:provider.stage}-google-calendar-event-queue',
      VisibilityTimeout: 300,
      RedrivePolicy: {
        maxReceiveCount: 5,
        deadLetterTargetArn: {
          'Fn::GetAtt': ['ContentfulPollerQueueDLQ', 'Arn'],
        },
      },
    },
  },
  GoogleCalendarEventQueueDLQ: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName:
        '${self:service}-${self:provider.stage}-google-calendar-event-queue-dlq',
    },
  },
  ApiGatewayAlarm5xx: {
    Type: 'AWS::CloudWatch::Alarm',
    Properties: {
      AlarmDescription: '5xx errors detected at API Gateway',
      Namespace: 'AWS/ApiGateway',
      MetricName: '5xx',
      Statistic: 'Sum',
      Threshold: 0,
      ComparisonOperator: 'GreaterThanThreshold',
      EvaluationPeriods: 1,
      Period: 60,
      AlarmActions: [{ Ref: 'TopicCloudwatchAlarm' }],
      TreatMissingData: 'notBreaching',
      Dimensions: [
        {
          Name: 'ApiId',
          Value: {
            Ref: 'HttpApi',
          },
        },
        {
          Name: 'Stage',
          Value: {
            Ref: 'HttpApiStage',
          },
        },
      ],
    },
  },
  TopicCloudwatchAlarm: {
    Type: 'AWS::SNS::Topic',
    Properties: {
      TopicName: '${self:custom.apiGateway5xxTopic}',
    },
  },
  CookiePreferencesDynamoDbTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      TableName: '${self:service}-${self:provider.stage}-cookie-preferences',
      AttributeDefinitions: [
        {
          AttributeName: 'cookieId',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'cookieId',
          KeyType: 'HASH',
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    },
  },
  InviteUserQueue: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName: '${self:service}-${self:provider.stage}-invite-user-queue',
      VisibilityTimeout: 120, // Matches lambda timeout
      RedrivePolicy: {
        maxReceiveCount: 5,
        deadLetterTargetArn: {
          'Fn::GetAtt': ['InviteUserQueueDLQ', 'Arn'],
        },
      },
    },
  },
  InviteUserQueueDLQ: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName: '${self:service}-${self:provider.stage}-invite-user-queue-dlq',
      MessageRetentionPeriod: 1209600, // 14 days
    },
  },
  ...(isProd && {
    ComplianceDocSyncQueue: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName:
          '${self:service}-${self:provider.stage}-compliance-doc-sync-queue',
        VisibilityTimeout: 120,
        RedrivePolicy: {
          maxReceiveCount: 5,
          deadLetterTargetArn: {
            'Fn::GetAtt': ['ComplianceDocSyncQueueDLQ', 'Arn'],
          },
        },
      },
    },
    ComplianceDocSyncQueueDLQ: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName:
          '${self:service}-${self:provider.stage}-compliance-doc-sync-queue-dlq',
        MessageRetentionPeriod: 1209600, // 14 days
      },
    },
  }),
  ...(shouldCreateDomain && {
    [opensearchDomain]: {
      Type: 'AWS::OpenSearchService::Domain',
      Properties: {
        DomainName: opensearchDomainName,
        EngineVersion: 'OpenSearch_2.19',
        ClusterConfig: {
          InstanceType: 't3.medium.search',
          InstanceCount: 1,
          DedicatedMasterEnabled: false,
          ZoneAwarenessEnabled: false,
        },
        EBSOptions: {
          EBSEnabled: true,
          VolumeType: 'gp3',
          VolumeSize: 20,
        },
        AccessPolicies: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                AWS: [
                  '*',
                  {
                    'Fn::GetAtt': ['IamRoleLambdaExecution', 'Arn'], // Add Lambda role
                  },
                ],
              },
              Action: 'es:*',
              Resource: {
                'Fn::Sub': `arn:aws:es:\${AWS::Region}:\${AWS::AccountId}:domain/${opensearchDomainName}/*`,
              },
            },
          ],
        },
        DomainEndpointOptions: {
          EnforceHTTPS: true,
          TLSSecurityPolicy: 'Policy-Min-TLS-1-2-2019-07',
        },
        EncryptionAtRestOptions: {
          Enabled: true,
        },
        NodeToNodeEncryptionOptions: {
          Enabled: true,
        },
        AdvancedSecurityOptions: {
          Enabled: true,
          InternalUserDatabaseEnabled: true,
          MasterUserOptions: {
            MasterUserName: opensearchMasterUser,
            MasterUserPassword: opensearchMasterPassword,
          },
        },
      },
      DeletionPolicy: 'Retain',
    },
  }),
};
