import { NotFoundError, GenericError } from '@asap-hub/errors';
import ManuscriptController from '../../src/controllers/manuscript.controller';
import { AssetContentfulDataProvider } from '../../src/data-providers/contentful/asset.data-provider';
import {
  AssetCreateData,
  ManuscriptDataProvider,
} from '../../src/data-providers/types';
import {
  getManuscriptDataObject,
  getManuscriptResponse,
  getManuscriptCreateDataObject,
  getManuscriptFileResponse,
} from '../fixtures/manuscript.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Manuscript controller', () => {
  const manuscriptDataProviderMock: jest.Mocked<ManuscriptDataProvider> =
    getDataProviderMock();
  const assetDataProviderMock =
    getDataProviderMock() as unknown as jest.Mocked<AssetContentfulDataProvider>;
  const manuscriptController = new ManuscriptController(
    manuscriptDataProviderMock,
    assetDataProviderMock,
  );

  describe('Fetch-by-ID method', () => {
    test('Should throw when working-group is not found', async () => {
      manuscriptDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(manuscriptController.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the manuscript when it finds it', async () => {
      manuscriptDataProviderMock.fetchById.mockResolvedValueOnce(
        getManuscriptDataObject(),
      );
      const result = await manuscriptController.fetchById('manuscript-id');

      expect(result).toEqual(getManuscriptResponse());
    });
  });

  describe('Create method', () => {
    test('Should throw when fails to create the manuscript', async () => {
      manuscriptDataProviderMock.create.mockRejectedValueOnce(
        new GenericError(),
      );

      await expect(
        manuscriptController.create(getManuscriptCreateDataObject()),
      ).rejects.toThrow(GenericError);
    });

    test('Should create the new manuscript and return it', async () => {
      const manuscriptId = 'manuscript-id-1';
      manuscriptDataProviderMock.create.mockResolvedValueOnce(manuscriptId);
      manuscriptDataProviderMock.fetchById.mockResolvedValueOnce(
        getManuscriptResponse(),
      );

      const result = await manuscriptController.create(
        getManuscriptCreateDataObject(),
      );

      expect(result).toEqual(getManuscriptResponse());
      expect(manuscriptDataProviderMock.create).toHaveBeenCalledWith(
        getManuscriptCreateDataObject(),
      );
    });
  });

  describe('Create-file method', () => {
    test('Should throw when fails to create the manuscript', async () => {
      assetDataProviderMock.create.mockRejectedValueOnce(new GenericError());

      await expect(
        manuscriptController.createFile({
          filename: 'file.pdf',
          content: Buffer.from('file-content'),
          contentType: 'application/pdf',
        }),
      ).rejects.toThrow(GenericError);
    });

    test('Should create the file as draft and return the response', async () => {
      const manuscriptFileCreateData = {
        content: Buffer.from('file-content'),
        contentType: 'application/pdf',
        filename: 'file.pdf',
      };
      const manuscriptFileResponse = getManuscriptFileResponse();

      assetDataProviderMock.create.mockResolvedValueOnce({
        id: manuscriptFileResponse.id,
        filename: manuscriptFileResponse.filename,
        url: manuscriptFileResponse.url,
      });

      const result = await manuscriptController.createFile(
        manuscriptFileCreateData,
      );

      expect(result).toEqual(manuscriptFileResponse);
      expect(assetDataProviderMock.create).toHaveBeenCalledWith({
        id: expect.any(String),
        title: 'Manuscript File',
        description: 'Manuscript File',
        filename: manuscriptFileCreateData.filename,
        content: manuscriptFileCreateData.content,
        contentType: manuscriptFileCreateData.contentType,
        publish: false,
      } satisfies AssetCreateData);
    });
  });
});
