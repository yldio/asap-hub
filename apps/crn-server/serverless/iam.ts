import { envAlias, isProd, opensearchDomainName } from './shared';

export const iamRoleStatements = [
  {
    Effect: 'Allow',
    Action: [
      'es:ESHttpGet',
      'es:ESHttpPost',
      'es:ESHttpPut',
      'es:ESHttpDelete',
      'es:ESHttpHead',
      'es:ESHttpPatch',
    ],
    Resource: {
      'Fn::Sub':
        'arn:aws:es:${AWS::Region}:${AWS::AccountId}:domain/${self:custom.opensearchDomainName}/*',
    },
  },
  {
    Effect: 'Allow',
    Action: ['es:DescribeDomain', 'es:DescribeDomains'],
    Resource: {
      'Fn::Sub':
        'arn:aws:es:${AWS::Region}:${AWS::AccountId}:domain/${self:custom.opensearchDomainName}',
    },
  },
  {
    Effect: 'Allow',
    Action: ['es:ListDomainNames'],
    Resource: '*',
  },
  {
    Effect: 'Allow',
    Action: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
    Resource: {
      'Fn::Join': [
        '',
        ['arn:aws:s3:::', '${self:service}-${self:provider.stage}-files', '/*'],
      ],
    },
  },
  {
    Effect: 'Allow',
    Action: ['lambda:InvokeFunction'],
    Resource: {
      'Fn::Sub':
        'arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:asap-hub-${self:provider.stage}-getPresignedUrl',
    },
  },
  {
    Effect: 'Allow',
    Action: [
      'es:ESHttpGet',
      'es:ESHttpPost',
      'es:ESHttpPut',
      'es:ESHttpDelete',
      'es:ESHttpHead',
      'es:ESHttpPatch',
      'es:DescribeDomain',
      'es:DescribeDomains',
      'es:ListDomainNames',
    ],
    Resource: {
      'Fn::Sub': `arn:aws:es:\${AWS::Region}:\${AWS::AccountId}:domain/${opensearchDomainName}/*`,
    },
  },
  {
    Effect: 'Allow',
    Action: ['es:DescribeDomain', 'es:DescribeDomains'],
    Resource: {
      'Fn::Sub': `arn:aws:es:\${AWS::Region}:\${AWS::AccountId}:domain/${opensearchDomainName}`,
    },
  },
  {
    Effect: 'Allow',
    Action: ['es:ListDomainNames'],
    Resource: '*',
  },
  {
    Effect: 'Allow',
    Action: ['lambda:InvokeFunction'],
    Resource: {
      'Fn::Sub':
        'arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:asap-hub-${self:provider.stage}-opensearch-search-handler',
    },
  },
  {
    Effect: 'Allow',
    Action: 's3:GetObject',
    Resource: [
      {
        'Fn::If': [
          'IsProd',
          'arn:aws:s3:::asap-hub-production-data-backup/*',
          'arn:aws:s3:::asap-hub-dev-data-backup/*',
        ],
      },
    ],
  },
  {
    Effect: 'Allow',
    Action: [
      'dynamodb:PutItem',
      'dynamodb:Get*',
      'dynamodb:Update*',
      'dynamodb:Delete*',
    ],
    Resource: {
      'Fn::Join': [
        ':',
        [
          'arn:aws:dynamodb',
          { Ref: 'AWS::Region' },
          { Ref: 'AWS::AccountId' },
          'table/${self:service}-${self:provider.stage}-cookie-preferences',
        ],
      ],
    },
  },
  {
    Effect: 'Allow',
    Action: 'secretsmanager:*',
    Resource: {
      'Fn::Join': [
        ':',
        [
          'arn:aws:secretsmanager',
          { Ref: 'AWS::Region' },
          { Ref: 'AWS::AccountId' },
          'secret',
          `google-api-credentials-${envAlias}*`,
        ],
      ],
    },
  },
  {
    Effect: 'Allow',
    Action: 'ses:SendTemplatedEmail',
    Resource: ['*'],
    Condition: {
      StringLike: {
        'ses:FromAddress': '*@asap.science',
      },
    },
  },
  {
    Effect: 'Allow',
    Action: 'events:*',
    Resource: {
      'Fn::Join': [
        ':',
        [
          'arn:aws:events',
          { Ref: 'AWS::Region' },
          { Ref: 'AWS::AccountId' },
          'event-bus/asap-events-${self:provider.stage}',
        ],
      ],
    },
  },
  {
    Effect: 'Allow',
    Action: ['cloudfront:CreateInvalidation'],
    Resource: ['*'],
  },
  {
    Effect: 'Allow',
    Action: [
      'sqs:SendMessage',
      'sqs:ReceiveMessage',
      'sqs:DeleteMessage',
      'sqs:GetQueueAttributes',
    ],
    Resource: {
      'Fn::GetAtt': ['ContentfulPollerQueue', 'Arn'],
    },
  },
  {
    Effect: 'Allow',
    Action: [
      'sqs:SendMessage',
      'sqs:ReceiveMessage',
      'sqs:DeleteMessage',
      'sqs:GetQueueAttributes',
    ],
    Resource: {
      'Fn::GetAtt': ['InviteUserQueue', 'Arn'],
    },
  },
  {
    Effect: 'Allow',
    Action: [
      'sqs:SendMessage',
      'sqs:ReceiveMessage',
      'sqs:DeleteMessage',
      'sqs:GetQueueAttributes',
    ],
    Resource: {
      'Fn::GetAtt': ['GoogleCalendarEventQueue', 'Arn'],
    },
  },
  ...(isProd
    ? [
        {
          Effect: 'Allow',
          Action: [
            'sqs:SendMessage',
            'sqs:ReceiveMessage',
            'sqs:DeleteMessage',
            'sqs:GetQueueAttributes',
          ],
          Resource: {
            'Fn::GetAtt': ['ComplianceDocSyncQueue', 'Arn'],
          },
        },
      ]
    : []),
];
