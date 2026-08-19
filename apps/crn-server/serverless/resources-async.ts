export const asyncResources = {
  SubscribeCalendarContentfulDLQ: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      MessageRetentionPeriod: 1_209_600, // 14 days
      QueueName:
        '${self:service}-${self:provider.stage}-subscribe-calendar-contentful-dlq',
    },
  },
  SubscribeCalendarContentfulDLQPolicy: {
    Type: 'AWS::SQS::QueuePolicy',
    Properties: {
      PolicyDocument: {
        Id: '${self:service}-${self:provider.stage}-subscribe-calendar-contentful-dlq-policy',
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'Publisher-statement-id',
            Effect: 'Allow',
            Principal: {
              AWS: '*',
            },
            Action: 'sqs:SendMessage',
            Resource: {
              'Fn::GetAtt': [`SubscribeCalendarContentfulDLQ`, 'Arn'],
            },
          },
        ],
      },
      Queues: [
        {
          Ref: `SubscribeCalendarContentfulDLQ`,
        },
      ],
    },
  },
};

export const asyncExtensions = {
  GcalSubscribeCalendarContentfulLambdaFunction: {
    Properties: {
      DeadLetterConfig: {
        TargetArn: {
          'Fn::GetAtt': ['SubscribeCalendarContentfulDLQ', 'Arn'],
        },
      },
    },
  },
};
