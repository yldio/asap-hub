import { SQSClient } from '@aws-sdk/client-sqs';
import EntryController from '../../../src/controllers/entry.controller';
import ManuscriptVersionController from '../../../src/controllers/manuscript-version.controller';
import { complianceEntryHandler } from '../../../src/handlers/compliance-sheet/compliance-entry-handler';

const sqsMock = {
  send: jest.fn(),
} as unknown as SQSClient;

const manuscriptVersionsControllerMock = {
  fetchManuscriptVersionIdsByLinkedEntry: jest.fn(),
} as unknown as jest.Mocked<ManuscriptVersionController>;

const entryControllerMock = {
  getChangedFields: jest.fn(),
} as unknown as jest.Mocked<EntryController>;

describe('Compliance Entry Handler', () => {
  afterEach(() => jest.clearAllMocks());
  const handler = complianceEntryHandler(
    sqsMock,
    manuscriptVersionsControllerMock,
    entryControllerMock,
  );

  test('should send message with manuscriptVersionId when event is ManuscriptVersions', async () => {
    const event = {
      'detail-type': 'ManuscriptVersionsPublished',
      detail: { resourceId: 'mv-123' },
    } as any;

    await handler(event);

    expect(entryControllerMock.getChangedFields).not.toHaveBeenCalled();
    expect(
      manuscriptVersionsControllerMock.fetchManuscriptVersionIdsByLinkedEntry,
    ).not.toHaveBeenCalled();

    expect(sqsMock.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          QueueUrl: expect.any(String),
          MessageBody: JSON.stringify({
            manuscriptVersionIds: ['mv-123'],
            sourceEvent: 'ManuscriptVersionsPublished',
          }),
        },
      }),
    );
  });

  test('should fetch manuscriptVersionIds and send message for non-manuscript events', async () => {
    manuscriptVersionsControllerMock.fetchManuscriptVersionIdsByLinkedEntry.mockResolvedValueOnce(
      ['mv-1', 'mv-2'],
    );

    const event = {
      'detail-type': 'UsersPublished',
      detail: { resourceId: 'user-123' },
    } as any;

    await handler(event);

    expect(entryControllerMock.getChangedFields).toHaveBeenCalledWith(
      'user-123',
    );

    expect(
      manuscriptVersionsControllerMock.fetchManuscriptVersionIdsByLinkedEntry,
    ).toHaveBeenCalledWith('user-123', 'users');

    expect(sqsMock.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          QueueUrl: expect.any(String),
          MessageBody: JSON.stringify({
            manuscriptVersionIds: ['mv-1', 'mv-2'],
            sourceEvent: 'UsersPublished',
          }),
        },
      }),
    );
  });

  test('should derive correct entityType from detail-type', async () => {
    manuscriptVersionsControllerMock.fetchManuscriptVersionIdsByLinkedEntry.mockResolvedValueOnce(
      [],
    );

    const event = {
      'detail-type': 'ComplianceReportsUnpublished',
      detail: { resourceId: 'compliance-report-1' },
    } as any;

    await handler(event);

    expect(
      manuscriptVersionsControllerMock.fetchManuscriptVersionIdsByLinkedEntry,
    ).toHaveBeenCalledWith('compliance-report-1', 'complianceReports');
  });

  test('should not send message when manuscriptVersionIds is empty', async () => {
    manuscriptVersionsControllerMock.fetchManuscriptVersionIdsByLinkedEntry.mockResolvedValueOnce(
      [],
    );

    const event = {
      'detail-type': 'UsersPublished',
      detail: { resourceId: 'user-123' },
    } as any;

    await handler(event);

    expect(sqsMock.send).not.toHaveBeenCalled();
  });

  test('should log and throw error if something fails', async () => {
    const error = new Error('FAIL');

    entryControllerMock.getChangedFields.mockRejectedValue(error);

    const event = {
      'detail-type': 'UsersPublished',
      detail: { resourceId: 'user-123' },
    } as any;

    await expect(handler(event)).rejects.toThrow(error);

    expect(sqsMock.send).not.toHaveBeenCalled();
  });
});
