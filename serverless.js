const { paramCase } = require('param-case');
const pkg = require('./package.json');

const { NODE_ENV = 'development' } = process.env;

const service = paramCase(pkg.name);
const plugins = [
  'serverless-s3-sync',
  ...(NODE_ENV === 'production'
    ? ['serverless-plugin-ncc']
    : ['serverless-offline']),
];

const cors = {
  origin: {
    'Fn::Join': [
      '',
      [
        'https://',
        {
          'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
        },
      ],
    ],
  },
  headers: ['*'],
  allowCredentials: false,
};

module.exports = {
  service,
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    timeout: 16,
    memorySize: 512,
    region: `\${env:AWS_REGION, "us-east-1"}`,
    stage: `\${env:SLS_STAGE, "development"}`,
  },
  package: {
    individually: true,
    // we don't need this because of ncc
    excludeDevDependencies: false,
  },
  custom: {
    s3Sync: [
      {
        bucketName: `\${self:service}-\${self:provider.stage}-static`,
        localDir: 'apps/frontend/build',
      },
    ],
  },
  functions: {
    'create-user': {
      handler: 'apps/user-service/build/handlers/create.handler',
      events: [
        {
          httpApi: {
            method: 'POST',
            path: `/api/users`,
            cors,
          },
        },
      ],
    },
    welcome: {
      handler: 'apps/user-service/build/handlers/welcome.handler',
      events: [
        {
          httpApi: {
            method: 'GET',
            path: `/api/users/{code}`,
            cors,
          },
        },
        {
          httpApi: {
            method: 'POST',
            path: `/api/users/{code}`,
            cors,
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
        DeletionPolicy: 'Delete',
        Properties: {
          BucketName: `\${self:service}-\${self:provider.stage}-static`,
          AccessControl: 'PublicRead',
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
        },
      },
      BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: `\${self:service}-\${self:provider.stage}-static`,
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject'],
                Effect: 'Allow',
                Principal: '*',
                Resource: {
                  'Fn::Join': ['', [{ 'Fn::GetAtt': ['Bucket', 'Arn'] }, '/*']],
                },
              },
            ],
          },
        },
      },
      CloudFrontOriginAccessIdentity: {
        Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
        Properties: {
          CloudFrontOriginAccessIdentityConfig: {
            Comment: { Ref: 'Bucket' },
          },
        },
      },
      CloudFrontDistribution: {
        Type: 'AWS::CloudFront::Distribution',
        DependsOn: ['Bucket', 'HttpApi'],
        Properties: {
          DistributionConfig: {
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
                  'Fn::GetAtt': ['Bucket', 'RegionalDomainName'],
                },
                Id: 's3origin',
                S3OriginConfig: {
                  OriginAccessIdentity: {
                    'Fn::Join': [
                      '/',
                      [
                        'origin-access-identity/cloudfront',
                        { Ref: 'CloudFrontOriginAccessIdentity' },
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
            CacheBehaviors: [
              {
                AllowedMethods: [
                  'HEAD',
                  'DELETE',
                  'POST',
                  'GET',
                  'OPTIONS',
                  'PUT',
                  'PATCH',
                ],
                CachedMethods: ['HEAD', 'GET', 'OPTIONS'],
                Compress: true,
                DefaultTTL: 0,
                ForwardedValues: {
                  Headers: ['Authorization', 'authorization'],
                  Cookies: {
                    Forward: 'all',
                  },
                  QueryString: true,
                },
                MaxTTL: 0,
                MinTTL: 0,
                PathPattern: '/api/*',
                TargetOriginId: 'apigw',
                ViewerProtocolPolicy: 'redirect-to-https',
              },
            ],
            DefaultRootObject: 'index.html',
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
              TargetOriginId: 's3origin',
              ViewerProtocolPolicy: 'redirect-to-https',
            },
            Enabled: true,
            PriceClass: 'PriceClass_100',
            ViewerCertificate: {
              CloudFrontDefaultCertificate: true,
            },
          },
        },
      },
    },
    Outputs: {
      StaticBucketName: {
        Value: `\${self:service}-\${self:provider.stage}-static`,
      },
      CloudFrontDistributionDomain: {
        Value: {
          'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'],
        },
      },
    },
  },
};
