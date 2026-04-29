import EntryController from '../../src/controllers/entry.controller';
import { EntryContentfulDataProvider } from '../../src/data-providers/contentful/entry.data-provider';

describe('EntryController', () => {
  const mockGetChangedFields = jest.fn();
  const mockEntryDataProvider = {
    getChangedFields: mockGetChangedFields,
  } as unknown as EntryContentfulDataProvider;

  const controller = new EntryController(mockEntryDataProvider);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls entryProvider.getChangedFields with the correct arguments and returns its result', async () => {
    const entryId = 'entry-id';

    mockGetChangedFields.mockResolvedValueOnce(['firstName']);

    const result = await controller.getChangedFields(entryId);

    expect(mockGetChangedFields).toHaveBeenCalledWith(entryId);
    expect(result).toEqual(['firstName']);
  });
});
