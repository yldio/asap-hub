import { Environment } from 'contentful-management';
import {
  checkIfAssetAlreadyExistsInContentful,
  createAsset,
  migrateAsset,
} from '../../src/utils';
import {
  squidexAsset,
  contenfulAsset,
  getContentfulEnvironmentMock,
  contenfulUploadAssetFields,
} from '../fixtures';

describe('checkIfAssetAlreadyExistsInContentful', () => {
  let envMock: Environment;
  console.log = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    envMock = getContentfulEnvironmentMock();
  });

  it('returns true if contentful getAsset returns an asset', async () => {
    jest.spyOn(envMock, 'getAsset').mockResolvedValueOnce(contenfulAsset);

    const isAssetInContentful = await checkIfAssetAlreadyExistsInContentful(
      envMock,
      squidexAsset.id,
    );
    expect(envMock.getAsset).toHaveBeenCalledWith(squidexAsset.id);
    expect(isAssetInContentful).toBe(true);
  });

  it('returns false if contentful getAsset returns a 404 error', async () => {
    const contenfulErrorResponse = new Error();
    contenfulErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getAsset')
      .mockRejectedValueOnce(contenfulErrorResponse);

    const isAssetInContentful = await checkIfAssetAlreadyExistsInContentful(
      envMock,
      squidexAsset.id,
    );
    expect(isAssetInContentful).toBe(false);
  });

  it('throws if contentful getAsset returns a 500 error', async () => {
    const contenfulErrorResponse = new Error();
    contenfulErrorResponse.message = '{"status":500}';
    jest
      .spyOn(envMock, 'getAsset')
      .mockRejectedValueOnce(contenfulErrorResponse);

    await expect(
      checkIfAssetAlreadyExistsInContentful(envMock, squidexAsset.id),
    ).rejects.toThrowError();
  });

  it('throws if contentful getAsset returns an unknown error', async () => {
    jest.spyOn(envMock, 'getAsset').mockRejectedValueOnce('unknown error');

    await expect(
      checkIfAssetAlreadyExistsInContentful(envMock, squidexAsset.id),
    ).rejects.toEqual('unknown error');
  });
});

describe('migrateAsset', () => {
  let envMock: Environment;

  beforeEach(async () => {
    jest.clearAllMocks();

    envMock = getContentfulEnvironmentMock();
  });

  it('calls createAssetWithId with correct payload', async () => {
    const contenfulErrorResponse = new Error();
    contenfulErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getAsset')
      .mockRejectedValueOnce(contenfulErrorResponse);

    jest
      .spyOn(envMock, 'createAssetWithId')
      .mockResolvedValueOnce(contenfulAsset);

    jest
      .spyOn(contenfulAsset, 'processForAllLocales')
      .mockResolvedValueOnce(contenfulAsset);

    await migrateAsset(envMock, [squidexAsset]);
    expect(envMock.createAssetWithId).toHaveBeenCalledWith('asset-id', {
      fields: contenfulUploadAssetFields,
    });

    expect(contenfulAsset.processForAllLocales).toHaveBeenCalled();
    expect(contenfulAsset.publish).toHaveBeenCalled();
  });
});

describe('createAsset', () => {
  let envMock: Environment;

  beforeEach(async () => {
    jest.clearAllMocks();

    envMock = getContentfulEnvironmentMock();
  });

  it('returns asset link payload properly', async () => {
    jest.spyOn(envMock, 'getAsset').mockResolvedValueOnce(contenfulAsset);

    const assetLinkPayload = await createAsset(envMock, [squidexAsset]);
    expect(assetLinkPayload).toEqual({
      sys: { id: 'asset-id', linkType: 'Asset', type: 'Link' },
    });
  });
});
