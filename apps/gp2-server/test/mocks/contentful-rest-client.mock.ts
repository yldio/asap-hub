import { Environment } from '@asap-hub/contentful';

export const getContentfulEnvironmentMock = (
  overrideProps: Partial<Environment> = {},
): jest.Mocked<Environment> =>
  ({
    createAssetFromFiles: jest.fn(),
    createEntry: jest.fn(),
    createPublishBulkAction: jest.fn(),
    createUnpublishBulkAction: jest.fn(),
    getEntries: jest.fn(),
    getEntry: jest.fn(),
    ...overrideProps,
  } as unknown as jest.Mocked<Environment>);
