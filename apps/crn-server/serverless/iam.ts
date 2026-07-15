import {
  envAlias,
  isProd,
  opensearchDomainName,
  queueArn,
  service,
  stage,
} from './shared';

const opensearchHttpActions = [
  'es:ESHttpGet',
  'es:ESHttpPost',
  'es:ESHttpPut',
  'es:ESHttpDelete',
  'es:ESHttpHead',
  'es:ESHttpPatch',
];

const describeOpensearchDomainStatement = {
  Effect: 'Allow',
  Action: ['es:DescribeDomain', 'es:DescribeDomains'],
  Resource: {
    'Fn::Sub': `arn:aws:es:\${AWS::Region}:\${AWS::AccountId}:domain/${opensearchDomainName}`,
  },
};

const listDomainNamesStatement = {
  Effect: 'Allow',
  Action: ['es:ListDomainNames'],
  Resource: '*',
};

const invokeOpensearchSearchHandlerStatement = {
  Effect: 'Allow',
  Action: ['lambda:InvokeFunction'],
  Resource: {
    'Fn::Sub':
      'arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:asap-hub-${self:provider.stage}-opensearch-search-handler',
  },
};

const googleApiSecretsStatement = {
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
};

const sesSendTemplatedEmailStatement = {
  Effect: 'Allow',
  Action: 'ses:SendTemplatedEmail',
  Resource: ['*'],
  Condition: {
    StringLike: {
      'ses:FromAddress': '*@asap.science',
    },
  },
};

const sqsActions = [
  'sqs:SendMessage',
  'sqs:ReceiveMessage',
  'sqs:DeleteMessage',
  'sqs:GetQueueAttributes',
];

const localSqsQueueAccess = (logicalId: string) => ({
  Effect: 'Allow',
  Action: sqsActions,
  Resource: {
    'Fn::GetAtt': [logicalId, 'Arn'],
  },
});

const crossStackSqsQueueAccess = (queueName: string) => ({
  Effect: 'Allow',
  Action: sqsActions,
  Resource: queueArn(queueName),
});

export const apiIamRoleStatements = [
  {
    Effect: 'Allow',
    Action: opensearchHttpActions,
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
  listDomainNamesStatement,
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
      ...opensearchHttpActions,
      'es:DescribeDomain',
      'es:DescribeDomains',
      'es:ListDomainNames',
    ],
    Resource: {
      'Fn::Sub': `arn:aws:es:\${AWS::Region}:\${AWS::AccountId}:domain/${opensearchDomainName}/*`,
    },
  },
  describeOpensearchDomainStatement,
  listDomainNamesStatement,
  invokeOpensearchSearchHandlerStatement,
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
  googleApiSecretsStatement,
  sesSendTemplatedEmailStatement,
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
  localSqsQueueAccess('ContentfulPollerQueue'),
  localSqsQueueAccess('InviteUserQueue'),
  localSqsQueueAccess('GoogleCalendarEventQueue'),
];

export const asyncIamRoleStatements = [
  {
    Effect: 'Allow',
    Action: opensearchHttpActions,
    Resource: {
      'Fn::Sub': `arn:aws:es:\${AWS::Region}:\${AWS::AccountId}:domain/${opensearchDomainName}/*`,
    },
  },
  describeOpensearchDomainStatement,
  listDomainNamesStatement,
  invokeOpensearchSearchHandlerStatement,
  {
    Effect: 'Allow',
    Action: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
    Resource: `arn:aws:s3:::${service}-${stage}-files/*`,
  },
  {
    Effect: 'Allow',
    Action: 's3:GetObject',
    Resource: [
      isProd
        ? 'arn:aws:s3:::asap-hub-production-data-backup/*'
        : 'arn:aws:s3:::asap-hub-dev-data-backup/*',
    ],
  },
  googleApiSecretsStatement,
  sesSendTemplatedEmailStatement,
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
          `event-bus/asap-events-${stage}`,
        ],
      ],
    },
  },
  crossStackSqsQueueAccess('contentful-poller-queue'),
  crossStackSqsQueueAccess('invite-user-queue'),
  crossStackSqsQueueAccess('google-calendar-event-queue'),
  ...(isProd ? [crossStackSqsQueueAccess('compliance-doc-sync-queue')] : []),
];
