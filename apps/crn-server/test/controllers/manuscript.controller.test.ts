import { NotFoundError, GenericError } from '@asap-hub/errors';
import { ManuscriptFileType, ManuscriptPostAuthor } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { when } from 'jest-when';
import ManuscriptController from '../../src/controllers/manuscript.controller';
import { AssetContentfulDataProvider } from '../../src/data-providers/contentful/asset.data-provider';
import { ExternalAuthorContentfulDataProvider } from '../../src/data-providers/contentful/external-author.data-provider';
import {
  AssetCreateData,
  ManuscriptDataProvider,
} from '../../src/data-providers/types';
import {
  getManuscriptDataObject,
  getManuscriptResponse,
  getManuscriptCreateDataObject,
  getManuscriptFileResponse,
  getManuscriptCreateControllerDataObject,
  getManuscriptUpdateStatusDataObject,
  getManuscriptsListResponse,
} from '../fixtures/manuscript.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';
import { manuscriptDataProviderMock as manuscriptDataProviderContentfulMock } from '../mocks/manuscript.data-provider.mock';

describe('Manuscript controller', () => {
  const manuscriptDataProviderMock: jest.Mocked<ManuscriptDataProvider> =
    manuscriptDataProviderContentfulMock;
  const externalAuthorDataProviderMock =
    getDataProviderMock() as unknown as jest.Mocked<ExternalAuthorContentfulDataProvider>;

  const assetDataProviderMock =
    getDataProviderMock() as unknown as jest.Mocked<AssetContentfulDataProvider>;
  const manuscriptController = new ManuscriptController(
    manuscriptDataProviderMock,
    externalAuthorDataProviderMock,
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

  describe('Fetch', () => {
    test('Should return the manuscripts', async () => {
      const manuscriptResponse = getManuscriptsListResponse().items[0]!;
      manuscriptDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [manuscriptResponse],
      });
      const result = await manuscriptController.fetch({});

      expect(result).toEqual({ items: [manuscriptResponse], total: 1 });
    });

    test('Should return empty list when there are no manuscripts', async () => {
      manuscriptDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await manuscriptController.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('Create method', () => {
    beforeEach(jest.clearAllMocks);

    test('Should throw when title is not unique', async () => {
      const manuscriptResponse = getManuscriptsListResponse().items[0]!;
      manuscriptResponse.title = 'Unique Title';
      manuscriptDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [manuscriptResponse],
      });

      const payload = getManuscriptCreateControllerDataObject();
      payload.title = 'Unique Title';

      await expect(manuscriptController.create(payload)).rejects.toThrow(
        Boom.badData('Title must be unique'),
      );
    });

    test('Should throw when fails to create the manuscript', async () => {
      manuscriptDataProviderMock.create.mockRejectedValueOnce(
        new GenericError(),
      );

      await expect(
        manuscriptController.create(getManuscriptCreateControllerDataObject()),
      ).rejects.toThrow(GenericError);
    });

    test('Should create the new manuscript and return it', async () => {
      const manuscriptId = 'manuscript-id-1';
      manuscriptDataProviderMock.create.mockResolvedValueOnce(manuscriptId);
      manuscriptDataProviderMock.fetchById.mockResolvedValueOnce(
        getManuscriptResponse(),
      );

      const result = await manuscriptController.create(
        getManuscriptCreateControllerDataObject(),
      );

      expect(result).toEqual(getManuscriptResponse());
      expect(manuscriptDataProviderMock.create).toHaveBeenCalledWith(
        getManuscriptCreateDataObject(),
      );
    });

    test('Should create a new external author', async () => {
      const manuscriptId = 'manuscript-id-1';
      const externalAuthor1 = {
        name: 'External One',
        email: 'external@one.com',
      };

      const externalAuthor2 = {
        name: 'External Two',
        email: 'external@two.com',
      };

      manuscriptDataProviderMock.create.mockResolvedValueOnce(manuscriptId);
      manuscriptDataProviderMock.fetchById.mockResolvedValueOnce(
        getManuscriptResponse(),
      );

      when(externalAuthorDataProviderMock.create)
        .calledWith(externalAuthor1)
        .mockResolvedValue('external-1');

      when(externalAuthorDataProviderMock.create)
        .calledWith(externalAuthor2)
        .mockResolvedValue('external-2');

      const payload = getManuscriptCreateControllerDataObject();
      payload.versions[0]!.firstAuthors = [
        { userId: 'author-1' },
        {
          externalAuthorName: externalAuthor1.name,
          externalAuthorEmail: externalAuthor1.email,
        },
      ];
      payload.versions[0]!.correspondingAuthor = {
        externalAuthorName: externalAuthor2.name,
        externalAuthorEmail: externalAuthor2.email,
      };

      const result = await manuscriptController.create(payload);

      expect(result).toEqual(getManuscriptResponse());

      expect(externalAuthorDataProviderMock.create).toHaveBeenNthCalledWith(
        1,
        externalAuthor1,
      );

      expect(externalAuthorDataProviderMock.create).toHaveBeenNthCalledWith(
        2,
        externalAuthor2,
      );
      expect(manuscriptDataProviderMock.create).toHaveBeenCalledWith({
        ...getManuscriptCreateDataObject(),
        versions: [
          {
            ...getManuscriptCreateDataObject().versions[0],
            firstAuthors: ['author-1', 'external-1'],
            correspondingAuthor: ['external-2'],
          },
        ],
      });
    });

    test('Should update an existing external author', async () => {
      const manuscriptId = 'manuscript-id-1';
      manuscriptDataProviderMock.create.mockResolvedValueOnce(manuscriptId);
      manuscriptDataProviderMock.fetchById.mockResolvedValueOnce(
        getManuscriptResponse(),
      );
      externalAuthorDataProviderMock.create.mockResolvedValueOnce(
        'existing-external-1',
      );

      const payload = getManuscriptCreateControllerDataObject();
      payload.versions[0]!.firstAuthors = [
        {
          userId: 'author-1',
        },
        {
          externalAuthorId: 'existing-external-1',
          externalAuthorName: 'Existing External',
          externalAuthorEmail: 'existing@external.com',
        },
      ];
      const result = await manuscriptController.create(payload);

      expect(result).toEqual(getManuscriptResponse());

      expect(externalAuthorDataProviderMock.update).toHaveBeenCalledWith(
        'existing-external-1',
        {
          email: 'existing@external.com',
        },
      );
      expect(manuscriptDataProviderMock.create).toHaveBeenCalledWith({
        ...getManuscriptCreateDataObject(),
        versions: [
          {
            ...getManuscriptCreateDataObject().versions[0],
            firstAuthors: ['author-1', 'existing-external-1'],
          },
        ],
      });
    });

    test('Should filter non valid authors', async () => {
      const manuscriptId = 'manuscript-id-1';
      manuscriptDataProviderMock.create.mockResolvedValueOnce(manuscriptId);
      manuscriptDataProviderMock.fetchById.mockResolvedValueOnce(
        getManuscriptResponse(),
      );
      externalAuthorDataProviderMock.create.mockResolvedValueOnce('external-1');

      const payload = getManuscriptCreateControllerDataObject();
      payload.versions[0]!.firstAuthors = [
        {
          userId: 'author-1',
        },
        {
          externalAuthorEmail: 'external@person.com',
        } as unknown as ManuscriptPostAuthor,
      ];
      const result = await manuscriptController.create(payload);

      expect(result).toEqual(getManuscriptResponse());

      expect(externalAuthorDataProviderMock.create).not.toHaveBeenCalled();
      expect(manuscriptDataProviderMock.create).toHaveBeenCalledWith({
        ...getManuscriptCreateDataObject(),
        versions: [
          {
            ...getManuscriptCreateDataObject().versions[0],
            firstAuthors: ['author-1'],
          },
        ],
      });
    });

    test('Should create with empty version', async () => {
      const manuscriptId = 'manuscript-id-1';
      manuscriptDataProviderMock.create.mockResolvedValueOnce(manuscriptId);
      manuscriptDataProviderMock.fetchById.mockResolvedValueOnce(
        getManuscriptResponse(),
      );

      const payload = getManuscriptCreateControllerDataObject();
      payload.versions = [];

      const result = await manuscriptController.create(payload);

      expect(result).toEqual(getManuscriptResponse());

      expect(manuscriptDataProviderMock.create).toHaveBeenCalledWith({
        ...getManuscriptCreateDataObject(),
        versions: [],
      });
    });
  });

  describe('Create-file method', () => {
    test('Should throw when fails to create the manuscript', async () => {
      assetDataProviderMock.create.mockRejectedValueOnce(new GenericError());

      await expect(
        manuscriptController.createFile({
          filename: 'file.pdf',
          fileType: 'Manuscript File' as ManuscriptFileType,
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
        fileType: 'Manuscript File' as ManuscriptFileType,
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

  describe('Create version method', () => {
    beforeEach(jest.clearAllMocks);

    const manuscriptId = 'manuscript-id-1';

    test('Should throw when creating a manuscript version with a title that is not unique', async () => {
      const manuscriptId = 'manuscript-id-1';

      const manuscriptResponse = getManuscriptsListResponse().items[0]!;
      manuscriptResponse.title = 'Unique Title';
      manuscriptResponse.id = 'another-manuscript-id';
      manuscriptDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [manuscriptResponse],
      });

      const payload = getManuscriptCreateControllerDataObject();
      payload.title = 'Unique Title';

      await expect(
        manuscriptController.createVersion(manuscriptId, payload),
      ).rejects.toThrow(Boom.badData('Title must be unique'));
    });

    test('Should throw when fails to create the manuscript version', async () => {
      manuscriptDataProviderMock.createVersion.mockRejectedValueOnce(
        new GenericError(),
      );

      await expect(
        manuscriptController.createVersion(
          manuscriptId,
          getManuscriptCreateControllerDataObject(),
        ),
      ).rejects.toThrow(GenericError);
    });

    test('Should create the new manuscript version and return manuscript', async () => {
      manuscriptDataProviderMock.createVersion.mockResolvedValueOnce();
      manuscriptDataProviderMock.fetchById.mockResolvedValueOnce(
        getManuscriptResponse(),
      );

      const result = await manuscriptController.createVersion(
        manuscriptId,
        getManuscriptCreateControllerDataObject(),
      );

      expect(result).toEqual(getManuscriptResponse());
      expect(manuscriptDataProviderMock.createVersion).toHaveBeenCalledWith(
        manuscriptId,
        getManuscriptCreateDataObject(),
      );
    });
  });

  describe('Update method', () => {
    beforeEach(jest.resetAllMocks);

    test('Should throw when updating a manuscript with a title that is not unique', async () => {
      const manuscriptId = 'manuscript-id-1';

      const manuscriptResponse = getManuscriptsListResponse().items[0]!;
      manuscriptResponse.title = 'Unique Title';
      manuscriptResponse.id = 'another-manuscript-id';
      manuscriptDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [manuscriptResponse],
      });

      await expect(
        manuscriptController.update(
          manuscriptId,
          { title: 'Unique Title' },
          'user-id',
        ),
      ).rejects.toThrow(Boom.badData('Title must be unique'));
    });

    test('Should not throw when updating a manuscript with the same title as before', async () => {
      const manuscriptId = 'manuscript-id-1';

      const manuscriptResponse = getManuscriptsListResponse().items[0]!;
      manuscriptResponse.title = 'Unique Title';
      manuscriptResponse.id = manuscriptId;
      manuscriptDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [manuscriptResponse],
      });
      manuscriptDataProviderMock.fetchById.mockResolvedValue(
        getManuscriptDataObject(manuscriptResponse),
      );

      await expect(
        manuscriptController.update(
          manuscriptId,
          { title: 'Unique Title' },
          'user-id',
        ),
      ).resolves.not.toThrow();
    });

    test('Should throw when fails to update the manuscript', async () => {
      const manuscriptId = 'manuscript-id-1';

      manuscriptDataProviderMock.update.mockRejectedValueOnce(
        new GenericError(),
      );

      await expect(
        manuscriptController.update(
          manuscriptId,
          { status: 'Manuscript Resubmitted' },
          'user-id',
        ),
      ).rejects.toThrow(GenericError);
    });

    test('Should throw when the manuscript does not exist', async () => {
      const manuscriptId = 'manuscript-id-1';

      manuscriptDataProviderMock.update.mockRejectedValueOnce(
        new NotFoundError(),
      );

      await expect(
        manuscriptController.update(
          manuscriptId,
          { status: 'Manuscript Resubmitted' },
          'user-id',
        ),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should update the manuscript status and return it', async () => {
      const manuscriptId = 'manuscript-id-1';
      manuscriptDataProviderMock.fetchById.mockResolvedValue(
        getManuscriptResponse(),
      );
      manuscriptDataProviderMock.update.mockResolvedValueOnce();

      const result = await manuscriptController.update(
        manuscriptId,
        { status: 'Manuscript Resubmitted' },
        'user-id',
      );

      expect(result).toEqual(getManuscriptResponse());
      expect(manuscriptDataProviderMock.update).toHaveBeenCalledWith(
        manuscriptId,
        getManuscriptUpdateStatusDataObject(),
        'user-id',
      );
    });

    test('Should update the manuscript version and return it', async () => {
      const manuscriptId = 'manuscript-id-1';
      manuscriptDataProviderMock.fetchById.mockResolvedValue(
        getManuscriptResponse(),
      );
      manuscriptDataProviderMock.update.mockResolvedValueOnce();

      const result = await manuscriptController.update(
        manuscriptId,
        {
          versions: [
            {
              lifecycle: 'Preprint',
              type: 'Original Research',
              teams: ['team-1'],
              manuscriptFile: getManuscriptFileResponse(),
              description: 'edited description',
              firstAuthors: [{ userId: 'author-1' }],
              correspondingAuthor: { userId: 'author-2' },
              additionalAuthors: [
                {
                  externalAuthorId: 'external-1',
                  externalAuthorName: 'External One',
                  externalAuthorEmail: 'external@one.com',
                },
              ],
            },
          ],
        },
        'user-id',
      );

      expect(result).toEqual(getManuscriptResponse());
      expect(manuscriptDataProviderMock.update).toHaveBeenCalledWith(
        manuscriptId,
        {
          versions: [
            {
              lifecycle: 'Preprint',
              type: 'Original Research',
              teams: ['team-1'],
              manuscriptFile: {
                filename: 'manuscript.pdf',
                id: 'file-id',
                url: 'https://example.com/manuscript.pdf',
              },
              description: 'edited description',
              firstAuthors: ['author-1'],
              correspondingAuthor: ['author-2'],
              additionalAuthors: ['external-1'],
            },
          ],
        },
        'user-id',
      );

      expect(externalAuthorDataProviderMock.update).toHaveBeenCalledWith(
        'external-1',
        {
          email: 'external@one.com',
        },
      );
    });

    test('Should update the manuscript version when corresponding author and additional authors are empty', async () => {
      const manuscriptId = 'manuscript-id-1';
      manuscriptDataProviderMock.fetchById.mockResolvedValue(
        getManuscriptResponse(),
      );
      manuscriptDataProviderMock.update.mockResolvedValueOnce();

      const result = await manuscriptController.update(
        manuscriptId,
        {
          versions: [
            {
              lifecycle: 'Preprint',
              type: 'Original Research',
              teams: ['team-1'],
              manuscriptFile: getManuscriptFileResponse(),
              description: 'edited description',
              firstAuthors: [{ userId: 'author-1' }],
              correspondingAuthor: undefined,
              additionalAuthors: [],
            },
          ],
        },
        'user-id',
      );

      expect(result).toEqual(getManuscriptResponse());
      expect(manuscriptDataProviderMock.update).toHaveBeenCalledWith(
        manuscriptId,
        {
          versions: [
            expect.objectContaining({
              correspondingAuthor: [],
              additionalAuthors: [],
            }),
          ],
        },
        'user-id',
      );
    });
  });
});
