import { SQSEvent } from 'aws-lambda';
import { CMSUser } from '../../../src/entities/user';

export const fetchUserResponse: CMSUser = {
  id: 'userId1',
  data: {
    email: { iv: 'testUser@asap.science' },
    displayName: { iv: 'TestUser' },
    skills: { iv: [] },
    lastModifiedDate: {
      iv: '2020-09-02T10:34:13.259Z',
    },
    orcid: { iv: '0000-0002-9079-593X' },
    orcidWorks: { iv: [] },
    teams: { iv: [] },
  },
  created: '2020-08-27T13:20:57Z',
  lastModified: '2020-08-31T13:57:51Z',
};

export const fetchUserResponseWithCode: CMSUser = {
  id: 'userId2',
  data: {
    email: { iv: 'testUser@asap.science' },
    displayName: { iv: 'TestUser' },
    skills: { iv: [] },
    lastModifiedDate: {
      iv: '2020-09-02T10:34:13.259Z',
    },
    orcid: { iv: '0000-0002-9079-593X' },
    orcidWorks: { iv: [] },
    teams: { iv: [] },
    connections: {
      iv: [
        {
          code: 'ASAP|already-received-email',
        },
      ],
    },
  },
  created: '2020-08-27T13:20:57Z',
  lastModified: '2020-08-31T13:57:51Z',
};

export const sqsEvent: SQSEvent = {
  Records: [
    {
      messageId: '059f36b4-87a3-44ab-83d2-661975830a7d',
      receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
      body: '["userId1", "userId2"]',
      attributes: {
        ApproximateReceiveCount: '1',
        SentTimestamp: '1545082649183',
        SenderId: 'AIDAIENQZJOLO23YVJ4VO',
        ApproximateFirstReceiveTimestamp: '1545082649185',
      },
      messageAttributes: {},
      md5OfBody: 'e4e68fb7bd0e697a0ae8f1bb342846b3',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
      awsRegion: 'us-east-1',
    },
  ],
};
