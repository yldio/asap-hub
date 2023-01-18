import { Environment } from 'contentful-management';
import {
  checkIfAssetAlreadyExistsInContentful,
  createAsset,
  createInlineAssets,
  migrateAsset,
} from '../../src/utils';
import {
  squidexAsset,
  contenfulAsset,
  contenfulUploadAssetFields,
} from '../fixtures';
import { getContentfulEnvironmentMock } from '../mocks/contentful.mocks';

describe('checkIfAssetAlreadyExistsInContentful', () => {
  let envMock: Environment;

  const consoleLogRef = console.log;

  beforeEach(async () => {
    jest.clearAllMocks();
    console.log = jest.fn();

    envMock = getContentfulEnvironmentMock();
  });

  afterAll(() => {
    console.log = consoleLogRef;
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

  const consoleLogRef = console.log;

  beforeEach(async () => {
    jest.clearAllMocks();
    console.log = jest.fn();

    envMock = getContentfulEnvironmentMock();
  });

  afterAll(() => {
    console.log = consoleLogRef;
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

describe('createInlineAssets', () => {
  let envMock: Environment;

  const consoleLogRef = console.log;

  beforeEach(async () => {
    jest.clearAllMocks();
    console.log = jest.fn();

    envMock = getContentfulEnvironmentMock();
  });

  afterAll(() => {
    console.log = consoleLogRef;
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

    await createInlineAssets(envMock, [
      ['asset-id', { fields: { ...contenfulUploadAssetFields } }],
    ]);
    expect(envMock.createAssetWithId).toHaveBeenCalledWith('asset-id', {
      fields: contenfulUploadAssetFields,
    });

    expect(contenfulAsset.processForAllLocales).toHaveBeenCalled();
    expect(contenfulAsset.publish).toHaveBeenCalled();
  });

  it('does not call createAssetWithId if asset already exist', async () => {
    jest.spyOn(envMock, 'getAsset').mockResolvedValueOnce(contenfulAsset);

    await createInlineAssets(envMock, [
      ['asset-id', { fields: { ...contenfulUploadAssetFields } }],
    ]);
    expect(envMock.createAssetWithId).not.toHaveBeenCalled();
    expect(contenfulAsset.processForAllLocales).not.toHaveBeenCalled();
    expect(contenfulAsset.publish).not.toHaveBeenCalled();
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
