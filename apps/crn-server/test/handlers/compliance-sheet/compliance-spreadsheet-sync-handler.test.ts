import { sqsComplianceSheetSyncHandlerFactory } from '../../../src/handlers/compliance-sheet/compliance-spreadsheet-sync-handler';

jest.mock('@asap-hub/server-common', () => {
  const actual = jest.requireActual('@asap-hub/server-common');

  return {
    ...actual,
    getWritableSheetsClient: jest.fn(() =>
      Promise.resolve({
        spreadsheets: {
          values: {
            get: jest.fn(),
            batchUpdate: jest.fn(),
            append: jest.fn(),
          },
        },
      }),
    ),
  };
});
const sheetsMock = {
  spreadsheets: {
    values: {
      get: jest.fn(),
      batchUpdate: jest.fn(),
      append: jest.fn(),
    },
  },
};

const sheetsClientMock = Promise.resolve(sheetsMock);

const manuscriptVersionControllerMock = {
  fetchComplianceManuscriptVersions: jest.fn(),
};

describe('Compliance Spreadsheet Sync Handler', () => {
  test('should skip when manuscriptVersionIds is empty', async () => {
    const handler = sqsComplianceSheetSyncHandlerFactory(
      sheetsClientMock as any,
      manuscriptVersionControllerMock as any,
    );

    const event = {
      Records: [
        {
          body: JSON.stringify({ manuscriptVersionIds: [] }),
        },
      ],
    } as any;

    await handler(event);

    expect(
      manuscriptVersionControllerMock.fetchComplianceManuscriptVersions,
    ).not.toHaveBeenCalled();

    expect(sheetsMock.spreadsheets.values.get).not.toHaveBeenCalled();
  });

  test('should fetch multiple manuscript versions and sync rows', async () => {
    // sheet already has one existing ID
    sheetsMock.spreadsheets.values.get.mockResolvedValue({
      data: { values: [['id'], ['mv-1']] },
    });

    manuscriptVersionControllerMock.fetchComplianceManuscriptVersions.mockResolvedValue(
      {
        items: [
          { id: 'mv-1', title: 'Existing Title' }, // should update
          { id: 'mv-2', title: 'New Title' }, // should append
        ],
      },
    );

    const handler = sqsComplianceSheetSyncHandlerFactory(
      sheetsClientMock as any,
      manuscriptVersionControllerMock as any,
    );

    const event = {
      Records: [
        {
          body: JSON.stringify({
            manuscriptVersionIds: ['mv-1', 'mv-2'],
          }),
        },
      ],
    } as any;

    await handler(event);

    expect(
      manuscriptVersionControllerMock.fetchComplianceManuscriptVersions,
    ).toHaveBeenCalledWith({
      filter: ['mv-1', 'mv-2'],
    });

    expect(sheetsMock.spreadsheets.values.batchUpdate).toHaveBeenCalled();
    expect(sheetsMock.spreadsheets.values.append).toHaveBeenCalled();
  });

  test('should append rows when manuscriptVersion is new', async () => {
    sheetsMock.spreadsheets.values.get.mockResolvedValue({
      data: { values: [['id']] }, // no existing IDs
    });

    manuscriptVersionControllerMock.fetchComplianceManuscriptVersions.mockResolvedValue(
      {
        items: [{ id: 'mv-2', title: 'New Title' }],
      },
    );

    const handler = sqsComplianceSheetSyncHandlerFactory(
      sheetsClientMock as any,
      manuscriptVersionControllerMock as any,
    );

    const event = {
      Records: [
        {
          body: JSON.stringify({ manuscriptVersionIds: ['mv-2'] }),
        },
      ],
    } as any;

    await handler(event);

    expect(sheetsMock.spreadsheets.values.append).toHaveBeenCalled();
  });

  test('should clear row when manuscript version is invalid', async () => {
    sheetsMock.spreadsheets.values.get.mockResolvedValue({
      data: { values: [['id'], ['mv-1']] },
    });

    manuscriptVersionControllerMock.fetchComplianceManuscriptVersions.mockResolvedValue(
      {
        items: [{ id: 'mv-1', title: '' }],
      },
    );

    const handler = sqsComplianceSheetSyncHandlerFactory(
      sheetsClientMock as any,
      manuscriptVersionControllerMock as any,
    );

    const event = {
      Records: [
        {
          body: JSON.stringify({ manuscriptVersionIds: ['mv-1'] }),
        },
      ],
    } as any;

    await handler(event);

    expect(sheetsMock.spreadsheets.values.batchUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        requestBody: expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              values: [Array(48).fill('')],
            }),
          ]),
        }),
      }),
    );
  });

  test('should log and throw when sync fails', async () => {
    const error = new Error('FAIL');

    sheetsMock.spreadsheets.values.get.mockRejectedValue(error);

    const handler = sqsComplianceSheetSyncHandlerFactory(
      sheetsClientMock as any,
      manuscriptVersionControllerMock as any,
    );

    const event = {
      Records: [
        {
          body: JSON.stringify({ manuscriptVersionIds: ['mv-1'] }),
        },
      ],
    } as any;

    await expect(handler(event)).rejects.toThrow(
      'Unable to sync manuscript versions [mv-1]',
    );
  });
});
