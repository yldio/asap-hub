import { Environment } from 'contentful-management';
import {
  checkIfAssetAlreadyExistsInContentful,
  createAsset,
  createInlineAssets,
  createMediaEntries,
  migrateAsset,
} from '../../src/utils';
import {
  squidexAsset,
  contenfulAsset,
  contenfulUploadAssetFields,
  getEntry,
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
    jest.resetAllMocks();
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

  it('does not throw if createAssetWithId rejects with conflict error (status 409)', async () => {
    const contenfulGetAssetErrorResponse = new Error();
    contenfulGetAssetErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getAsset')
      .mockRejectedValueOnce(contenfulGetAssetErrorResponse)
      .mockResolvedValueOnce(contenfulAsset);

    const contenfulCreateAssetWithIdErrorResponse = new Error();
    contenfulCreateAssetWithIdErrorResponse.message = '{"status":409}';
    jest
      .spyOn(envMock, 'createAssetWithId')
      .mockRejectedValueOnce(contenfulCreateAssetWithIdErrorResponse);

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

  it('throws if createAssetWithId rejects with an error different from conflict (status 409)', async () => {
    const contenfulGetAssetErrorResponse = new Error();
    contenfulGetAssetErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getAsset')
      .mockRejectedValueOnce(contenfulGetAssetErrorResponse);

    const contenfulCreateAssetWithIdErrorResponse = new Error();
    contenfulCreateAssetWithIdErrorResponse.message = '{"status":400}';
    jest
      .spyOn(envMock, 'createAssetWithId')
      .mockRejectedValueOnce(contenfulCreateAssetWithIdErrorResponse);

    jest
      .spyOn(contenfulAsset, 'processForAllLocales')
      .mockResolvedValueOnce(contenfulAsset);

    await expect(migrateAsset(envMock, [squidexAsset])).rejects.toThrow();
  });

  it('does not throw if processForAllLocales rejects with "File has already been processed" error', async () => {
    const contenfulGetAssetErrorResponse = new Error();
    contenfulGetAssetErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getAsset')
      .mockRejectedValueOnce(contenfulGetAssetErrorResponse);

    jest
      .spyOn(envMock, 'createAssetWithId')
      .mockResolvedValueOnce(contenfulAsset);

    const contenfulProcessForAllLocalesErrorResponse = new Error();
    contenfulProcessForAllLocalesErrorResponse.message =
      '{"message":"File has already been processed."}';
    jest
      .spyOn(contenfulAsset, 'processForAllLocales')
      .mockRejectedValueOnce(contenfulProcessForAllLocalesErrorResponse);

    await migrateAsset(envMock, [squidexAsset]);
    expect(envMock.createAssetWithId).toHaveBeenCalledWith('asset-id', {
      fields: contenfulUploadAssetFields,
    });

    expect(contenfulAsset.processForAllLocales).toHaveBeenCalled();
    expect(contenfulAsset.publish).not.toHaveBeenCalled();
  });

  it('throws if processForAllLocales rejects with an error different from "File has already been processed"', async () => {
    const contenfulGetAssetErrorResponse = new Error();
    contenfulGetAssetErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getAsset')
      .mockRejectedValueOnce(contenfulGetAssetErrorResponse);

    const contenfulProcessForAllLocalesErrorResponse = new Error();
    contenfulProcessForAllLocalesErrorResponse.message =
      '{"message":"Random Error."}';
    contenfulAsset.processForAllLocales = jest
      .fn()
      .mockRejectedValueOnce(contenfulProcessForAllLocalesErrorResponse);
    jest
      .spyOn(envMock, 'createAssetWithId')
      .mockResolvedValueOnce(contenfulAsset);

    await expect(migrateAsset(envMock, [squidexAsset])).rejects.toThrow();
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

describe('createMediaEntries', () => {
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

  const mediaId = 'videoId';
  const mediaURL = 'http://vimeo.com/video';
  const mediaPayload = {
    fields: {
      url: {
        'en-US': mediaURL,
      },
    },
  };

  it('creates media when it does not exist in Contentful yet', async () => {
    const entry = getEntry({ url: mediaURL });

    const contenfulErrorResponse = new Error();
    contenfulErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getEntry')
      .mockRejectedValueOnce(contenfulErrorResponse);

    jest.spyOn(envMock, 'createEntryWithId').mockResolvedValueOnce(entry);

    await createMediaEntries(envMock, [[mediaId, mediaPayload]]);

    expect(envMock.createEntryWithId).toHaveBeenCalledWith(
      'media',
      mediaId,
      mediaPayload,
    );

    expect(entry.publish).toHaveBeenCalled();
  });

  it('does not create media when it already exists on contentful', async () => {
    const entry = getEntry({ url: mediaURL });

    jest.spyOn(envMock, 'getEntry').mockResolvedValueOnce(entry);

    await createMediaEntries(envMock, [[mediaId, mediaPayload]]);

    expect(envMock.createEntryWithId).not.toHaveBeenCalled();
    expect(entry.publish).not.toHaveBeenCalled();
  });

  it('does not throw if createEntryWithId rejects with conflict error (status 409)', async () => {
    const mediaEntry = getEntry({ url: mediaURL });

    const contenfulErrorResponse = new Error();
    contenfulErrorResponse.message = '{"status":404}';
    jest
      .spyOn(envMock, 'getEntry')
      .mockRejectedValueOnce(contenfulErrorResponse)
      .mockResolvedValueOnce(mediaEntry);

    const contenfulCreateEntryWithIdErrorResponse = new Error();
    contenfulCreateEntryWithIdErrorResponse.message = '{"status":409}';
    jest
      .spyOn(envMock, 'createEntryWithId')
      .mockRejectedValueOnce(contenfulCreateEntryWithIdErrorResponse);

    await createMediaEntries(envMock, [[mediaId, mediaPayload]]);

    expect(envMock.createEntryWithId).toHaveBeenCalledWith(
      'media',
      mediaId,
      mediaPayload,
    );

    expect(mediaEntry.publish).toHaveBeenCalled();
  });
});
