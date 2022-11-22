import { Environment } from 'contentful-management';
import { createAssetLink } from '../../src/utils';
import { asset, entry, getContentfulEnvironmentMock } from '../fixtures';

describe('createAssetLink', () => {
  let envMock: Environment;

  beforeEach(async () => {
    jest.clearAllMocks();

    envMock = await getContentfulEnvironmentMock();
  });

  it('calls getEntries with the given contentModel', async () => {
    await createAssetLink(envMock, asset);

    expect(envMock.getEntries).toHaveBeenCalledWith({ content_type: 'news' });
  });
});
