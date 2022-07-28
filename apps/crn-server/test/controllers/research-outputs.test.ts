import { GenericError, NotFoundError } from '@asap-hub/errors';
import { when } from 'jest-when';
import ResearchOutputs from '../../src/controllers/research-outputs';
import { FetchResearchOutputOptions } from '../../src/data-providers/research-outputs.data-provider';
import {
  getResearchOutputCreateData,
  getResearchOutputCreateDataObject,
  getResearchOutputDataObject,
  getResearchOutputResponse,
  getResearchOutputUpdateData,
  getResearchOutputUpdateDataObject,
} from '../fixtures/research-output.fixtures';
import { getFullListResearchTagDataObject } from '../fixtures/research-tag.fixtures';
import { researchOutputDataProviderMock } from '../mocks/research-output-data-provider.mock';
import { researchTagDataProviderMock } from '../mocks/research-tag-data-provider.mock';
import { externalAuthorDataProviderMock } from '../mocks/external-author-data-provider.mock';

describe('ResearchOutputs controller', () => {
  const researchOutputs = new ResearchOutputs(
    researchOutputDataProviderMock,
    researchTagDataProviderMock,
    externalAuthorDataProviderMock,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the reserach outputs', async () => {
      researchOutputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getResearchOutputDataObject()],
      });

      const result = await researchOutputs.fetch({});

      expect(result).toEqual({
        items: [getResearchOutputResponse()],
        total: 1,
      });
    });

    test('Should return an empty list when there are no research outputs', async () => {
      researchOutputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await researchOutputs.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with the correct parameters', async () => {
      researchOutputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const fetchOptions = {
        filter: { documentType: 'document-type', link: 'link', title: 'title' },
        includeDrafts: true,
        search: 'search',
        skip: 13,
        take: 7,
      };
      await researchOutputs.fetch(fetchOptions);

      const expectedFetchOptions: FetchResearchOutputOptions = fetchOptions;
      expect(researchOutputDataProviderMock.fetch).toBeCalledWith(
        expectedFetchOptions,
      );
    });

    test('Should transform an array filter into a an documentType array fetch option', async () => {
      researchOutputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const documentTypes = ['one', 'two'];
      const fetchOptions = { filter: documentTypes };
      await researchOutputs.fetch(fetchOptions);

      const expectedFetchOptions: FetchResearchOutputOptions = {
        filter: {
          documentType: documentTypes,
        },
      };
      expect(researchOutputDataProviderMock.fetch).toBeCalledWith(
        expectedFetchOptions,
      );
    });
  });

  describe('Fetch-by-ID method', () => {
    test('Should throw when research-output is not found', async () => {
      researchOutputDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(researchOutputs.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the research output when it finds it', async () => {
      researchOutputDataProviderMock.fetchById.mockResolvedValueOnce(
        getResearchOutputDataObject(),
      );
      const result = await researchOutputs.fetchById('group-id');

      expect(result).toEqual(getResearchOutputResponse());
    });
  });

  describe('Create method', () => {
    beforeEach(() => {
      researchOutputDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      researchOutputDataProviderMock.fetchById.mockResolvedValue(
        getResearchOutputDataObject(),
      );

      researchTagDataProviderMock.fetch.mockResolvedValueOnce(
        getFullListResearchTagDataObject(),
      );
    });

    test('Should throw when fails to create the research output', async () => {
      researchOutputDataProviderMock.create.mockRejectedValueOnce(
        new GenericError(),
      );

      expect(
        researchOutputs.create(getResearchOutputCreateData()),
      ).rejects.toThrow(GenericError);
    });

    test('Should create the new research output and return it', async () => {
      const researchOutputCreateData = getResearchOutputCreateData();
      const researchOutputId = 'research-output-id-1';
      researchOutputDataProviderMock.create.mockResolvedValueOnce(
        researchOutputId,
      );

      const result = await researchOutputs.create(researchOutputCreateData);

      expect(result).toEqual(getResearchOutputResponse());

      const researchOutputCreateDataObject =
        getResearchOutputCreateDataObject();
      expect(researchOutputDataProviderMock.create).toBeCalledWith(
        researchOutputCreateDataObject,
      );
    });

    describe('Validating uniqueness', () => {
      const researchOutputRequest = getResearchOutputCreateData();
      researchOutputRequest.title = 'some-test-title';
      researchOutputRequest.link = 'https://some-test-link.com';

      test('Should throw error when a research output with the same type and title already exists', async () => {
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });

        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 0,
            items: [],
          });

        await expect(
          researchOutputs.create(researchOutputRequest),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/title',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/title/unique',
              },
            ],
          }),
        );
      });

      test('Should throw error when a research output with the same link already exists', async () => {
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 0,
            items: [],
          });

        await expect(
          researchOutputs.create(researchOutputRequest),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/link',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/link/unique',
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when a research output with the same type and title and link already exists', async () => {
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getResearchOutputDataObject()],
          });

        await expect(
          researchOutputs.create(researchOutputRequest),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/title',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/title/unique',
              },
              {
                instancePath: '/link',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/link/unique',
              },
            ],
          }),
        );
      });
    });

    describe('Parsing Research Tags', () => {
      test('Should forward the missing subtype to data provider as undefined', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        delete researchOutputInputData.subtype;

        await researchOutputs.create(researchOutputInputData);
        expect(researchOutputDataProviderMock.create).toBeCalledWith(
          expect.objectContaining({
            subtypeId: undefined,
          }),
        );
      });

      test('Should throw a validation error when the selected method does not exist', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        researchOutputInputData.methods = [
          'Activity Assay',
          'non-existent-method',
        ];

        await expect(
          researchOutputs.create(researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'methods',
                keyword: 'invalid',
                message: 'non-existent-method does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/method/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected organism does not exist', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        researchOutputInputData.organisms = ['Rat', 'non-existent-organism'];

        await expect(
          researchOutputs.create(researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'organisms',
                keyword: 'invalid',
                message: 'non-existent-organism does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/organism/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected environment does not exist', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        researchOutputInputData.environments = [
          'In Vitro',
          'non-existent-environment',
        ];

        await expect(
          researchOutputs.create(researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'environments',
                keyword: 'invalid',
                message: 'non-existent-environment does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/environment/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected subtype does not exist', async () => {
        const researchOutputInputData = getResearchOutputCreateData();
        researchOutputInputData.subtype = 'non-existent-subtype';

        await expect(
          researchOutputs.create(researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'subtype',
                keyword: 'invalid',
                message: 'non-existent-subtype does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/subtype/invalid`,
              },
            ],
          }),
        );
      });
    });

    describe('Authors', () => {
      test('Should throw when cannot create an external author', async () => {
        externalAuthorDataProviderMock.create.mockRejectedValueOnce(
          new GenericError(),
        );

        await expect(
          researchOutputs.create({
            ...getResearchOutputCreateData(),
            authors: [{ externalAuthorName: 'Chris Blue' }],
          }),
        ).rejects.toThrow(GenericError);
      });

      test('Should create a new external author and associate with the research-output', async () => {
        const externalAuthorId = 'external-author-id-1';
        externalAuthorDataProviderMock.create.mockResolvedValueOnce(
          externalAuthorId,
        );

        await researchOutputs.create({
          ...getResearchOutputCreateData(),
          authors: [{ externalAuthorName: 'Chris Blue' }],
        });

        expect(externalAuthorDataProviderMock.create).toBeCalledWith({
          name: 'Chris Blue',
        });
        expect(researchOutputDataProviderMock.create).toBeCalledWith(
          expect.objectContaining({
            authors: [
              {
                externalAuthorId: externalAuthorId,
              },
            ],
          }),
        );
      });
    });
  });

  describe('Update method', () => {
    const researchOutputId = 'updated-output-id';

    beforeEach(() => {
      const researchOutputDataObject = getResearchOutputDataObject();
      researchOutputDataObject.id = researchOutputId;
      researchOutputDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [researchOutputDataObject],
      });
      researchOutputDataProviderMock.fetchById.mockResolvedValue(
        getResearchOutputDataObject(),
      );

      researchTagDataProviderMock.fetch.mockResolvedValueOnce(
        getFullListResearchTagDataObject(),
      );
    });

    test('Should throw when fails to update the research output', async () => {
      researchOutputDataProviderMock.update.mockRejectedValueOnce(
        new GenericError(),
      );

      expect(
        researchOutputs.update(researchOutputId, getResearchOutputUpdateData()),
      ).rejects.toThrow(GenericError);
    });

    test('Should throw when the research output does not exist', async () => {
      researchOutputDataProviderMock.update.mockRejectedValueOnce(
        new NotFoundError(),
      );

      expect(
        researchOutputs.update(researchOutputId, getResearchOutputUpdateData()),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should update the research output and return it', async () => {
      const researchOutputUpdateData = getResearchOutputUpdateData();
      researchOutputDataProviderMock.update.mockResolvedValueOnce(
        researchOutputId,
      );

      const result = await researchOutputs.update(
        researchOutputId,
        researchOutputUpdateData,
      );

      expect(result).toEqual(getResearchOutputResponse());

      const researchOutputUpdateDataObject =
        getResearchOutputUpdateDataObject();
      expect(researchOutputDataProviderMock.update).toBeCalledWith(
        researchOutputId,
        researchOutputUpdateDataObject,
      );
    });

    describe('Validating uniqueness', () => {
      const researchOutputDataObject = getResearchOutputDataObject();
      researchOutputDataObject.id = researchOutputId;

      const researchOutputRequest = getResearchOutputUpdateData();
      researchOutputRequest.title = 'some-test-title';
      researchOutputRequest.link = 'https://some-test-link.com';

      test('Should throw an error when a different research output with the same type and title already exists', async () => {
        const otherResearchOutputDataObject = getResearchOutputDataObject();
        otherResearchOutputDataObject.id = 'another-research-output-id';
        // returns this research output and another one with the same type and title
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 2,
            items: [researchOutputDataObject, otherResearchOutputDataObject],
          });
        // returns this research output only
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [researchOutputDataObject],
          });

        await expect(
          researchOutputs.update(researchOutputId, researchOutputRequest),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/title',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/title/unique',
              },
            ],
          }),
        );
      });

      test('Should throw error when a research output with the same link already exists', async () => {
        const otherResearchOutputDataObject = getResearchOutputDataObject();
        otherResearchOutputDataObject.id = 'another-research-output-id';
        // returns this research output and another one with the link
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 2,
            items: [researchOutputDataObject, otherResearchOutputDataObject],
          });

        // returns this research output only
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [researchOutputDataObject],
          });

        await expect(
          researchOutputs.update(researchOutputId, researchOutputRequest),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/link',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/link/unique',
              },
            ],
          }),
        );
      });

      test('Should throw two validation errors when a research output with the same type and title and link already exists', async () => {
        const otherResearchOutputDataObject = getResearchOutputDataObject();
        otherResearchOutputDataObject.id = 'another-research-output-id';
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: researchOutputRequest.title,
              documentType: researchOutputRequest.documentType,
            },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 2,
            items: [researchOutputDataObject, otherResearchOutputDataObject],
          });
        when(researchOutputDataProviderMock.fetch)
          .calledWith({
            filter: { link: researchOutputRequest.link },
            includeDrafts: true,
          })
          .mockResolvedValueOnce({
            total: 2,
            items: [researchOutputDataObject, otherResearchOutputDataObject],
          });

        await expect(
          researchOutputs.update(researchOutputId, researchOutputRequest),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [
              {
                instancePath: '/title',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/title/unique',
              },
              {
                instancePath: '/link',
                keyword: 'unique',
                message: 'must be unique',
                params: {
                  type: 'string',
                },
                schemaPath: '#/properties/link/unique',
              },
            ],
          }),
        );
      });
    });

    describe('Parsing Research Tags', () => {
      test('Should throw a validation error when the selected method does not exist', async () => {
        const researchOutputInputData = getResearchOutputUpdateData();
        researchOutputInputData.methods = [
          'Activity Assay',
          'non-existent-method',
        ];

        await expect(
          researchOutputs.update(researchOutputId, researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'methods',
                keyword: 'invalid',
                message: 'non-existent-method does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/method/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected organism does not exist', async () => {
        const researchOutputInputData = getResearchOutputUpdateData();
        researchOutputInputData.organisms = ['Rat', 'non-existent-organism'];

        await expect(
          researchOutputs.update(researchOutputId, researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'organisms',
                keyword: 'invalid',
                message: 'non-existent-organism does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/organism/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected environment does not exist', async () => {
        const researchOutputInputData = getResearchOutputUpdateData();
        researchOutputInputData.environments = [
          'In Vitro',
          'non-existent-environment',
        ];

        await expect(
          researchOutputs.update(researchOutputId, researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'environments',
                keyword: 'invalid',
                message: 'non-existent-environment does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/environment/invalid`,
              },
            ],
          }),
        );
      });

      test('Should throw a validation error when the selected subtype does not exist', async () => {
        const researchOutputInputData = getResearchOutputUpdateData();
        researchOutputInputData.subtype = 'non-existent-subtype';

        await expect(
          researchOutputs.update(researchOutputId, researchOutputInputData),
        ).rejects.toThrowError(
          expect.objectContaining({
            message: 'Validation error',
            data: [
              {
                instancePath: 'subtype',
                keyword: 'invalid',
                message: 'non-existent-subtype does not exist',
                params: {
                  type: 'string',
                },
                schemaPath: `#/properties/subtype/invalid`,
              },
            ],
          }),
        );
      });
    });

    describe('Authors', () => {
      test('Should throw when cannot create an external author', async () => {
        externalAuthorDataProviderMock.create.mockRejectedValueOnce(
          new GenericError(),
        );

        await expect(
          researchOutputs.update(researchOutputId, {
            ...getResearchOutputUpdateData(),
            authors: [{ externalAuthorName: 'Chris Blue' }],
          }),
        ).rejects.toThrow(GenericError);
      });

      test('Should create a new external author and associate with the research-output', async () => {
        const externalAuthorId = 'external-author-id-1';
        externalAuthorDataProviderMock.create.mockResolvedValueOnce(
          externalAuthorId,
        );

        await researchOutputs.update(researchOutputId, {
          ...getResearchOutputUpdateData(),
          authors: [{ externalAuthorName: 'Chris Blue' }],
        });

        expect(externalAuthorDataProviderMock.create).toBeCalledWith({
          name: 'Chris Blue',
        });
        expect(researchOutputDataProviderMock.update).toBeCalledWith(
          researchOutputId,
          expect.objectContaining({
            authors: [
              {
                externalAuthorId: externalAuthorId,
              },
            ],
          }),
        );
      });
    });
  });
});
