import { NotFoundError, GenericError } from '@asap-hub/errors';
import ManuscriptController from '../../src/controllers/manuscript.controller';
import {
  getManuscriptDataObject,
  getManuscriptResponse,
  getManuscriptCreateDataObject,
} from '../fixtures/manuscript.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Manuscript controller', () => {
  const manuscriptDataProviderMock = getDataProviderMock();
  const manuscriptController = new ManuscriptController(
    manuscriptDataProviderMock,
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
});
