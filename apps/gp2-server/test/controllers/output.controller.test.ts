import { GenericError, NotFoundError } from '@asap-hub/errors';
import { gp2 as gp2Model } from '@asap-hub/model';
import { when } from 'jest-when';
import Outputs, {
  ERROR_UNIQUE_LINK,
} from '../../src/controllers/output.controller';
import {
  getOutputCreateData,
  getOutputCreateDataObject,
  getOutputDataObject,
  getOutputResponse,
  getOutputUpdateData,
  getOutputUpdateDataObject,
} from '../fixtures/output.fixtures';
import { externalUserDataProviderMock } from '../mocks/external-user.data-provider.mock';
import { generativeContentDataProviderMock } from '../mocks/generative-content.data-provider.mock';
import { outputDataProviderMock } from '../mocks/output.data-provider.mock';

describe('outputs controller', () => {
  const outputs = new Outputs(
    outputDataProviderMock,
    externalUserDataProviderMock,
    generativeContentDataProviderMock,
  );

  afterEach(jest.resetAllMocks);

  describe('Fetch', () => {
    test('Should return the outputs', async () => {
      outputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getOutputDataObject()],
      });

      const result = await outputs.fetch({});

      expect(result).toEqual({
        items: [getOutputResponse()],
        total: 1,
      });
    });

    test('Should return an empty list when there are no outputs', async () => {
      outputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await outputs.fetch({});

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with the correct parameters', async () => {
      outputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const fetchOptions: gp2Model.FetchOutputOptions = {
        filter: {
          documentType: ['Article'],
          link: 'link',
          title: 'title',
          gp2Supported: 'Yes',
          sharingStatus: 'Public',
        },
        search: 'search',
        skip: 13,
        take: 7,
      };
      await outputs.fetch(fetchOptions);

      const expectedFetchOptions: gp2Model.FetchOutputOptions = fetchOptions;
      expect(outputDataProviderMock.fetch).toHaveBeenCalledWith(
        expectedFetchOptions,
      );
    });

    test('Should transform an array filter into a an documentType array fetch option', async () => {
      outputDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });

      const documentTypes: gp2Model.OutputDocumentType[] = [
        'Dataset',
        'Article',
      ];
      const fetchOptions = { filter: documentTypes };
      await outputs.fetch(fetchOptions);

      const expectedFetchOptions: gp2Model.FetchOutputOptions = {
        filter: {
          documentType: documentTypes,
        },
      };
      expect(outputDataProviderMock.fetch).toBeCalledWith(expectedFetchOptions);
    });
  });

  describe('Fetch-by-ID method', () => {
    test('Should throw when output is not found', async () => {
      outputDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(outputs.fetchById('not-found')).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should return the output when it finds it', async () => {
      outputDataProviderMock.fetchById.mockResolvedValueOnce(
        getOutputDataObject(),
      );
      const result = await outputs.fetchById('group-id');

      expect(result).toEqual(getOutputResponse());
    });
  });

  describe('Create method', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      outputDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      outputDataProviderMock.fetchById.mockResolvedValue(getOutputDataObject());
    });

    test('Should throw when fails to create the output', async () => {
      outputDataProviderMock.create.mockRejectedValueOnce(new GenericError());

      await expect(outputs.create(getOutputCreateData())).rejects.toThrow(
        GenericError,
      );
    });

    describe('Validating uniqueness', () => {
      const outputRequest = getOutputCreateData();
      outputRequest.title = 'some-test-title';
      outputRequest.link = 'https://some-test-link.com';

      test('Should throw error when a output with the same type and title already exists', async () => {
        when(outputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: outputRequest.title,
              documentType: [outputRequest.documentType],
            },
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getOutputDataObject()],
          });

        when(outputDataProviderMock.fetch)
          .calledWith({
            filter: { link: outputRequest.link },
          })
          .mockResolvedValueOnce({
            total: 0,
            items: [],
          });

        await expect(outputs.create(outputRequest)).rejects.toThrow(
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

      test('Should throw error when a output with the same link already exists', async () => {
        when(outputDataProviderMock.fetch)
          .calledWith({
            filter: { link: outputRequest.link },
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getOutputDataObject()],
          });
        when(outputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: outputRequest.title,
              documentType: [outputRequest.documentType],
            },
          })
          .mockResolvedValueOnce({
            total: 0,
            items: [],
          });

        await expect(outputs.create(outputRequest)).rejects.toThrow(
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

      test('Should throw a validation error when a output with the same type and title and link already exists', async () => {
        when(outputDataProviderMock.fetch)
          .calledWith({
            filter: {
              title: outputRequest.title,
              documentType: [outputRequest.documentType],
            },
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getOutputDataObject()],
          });
        when(outputDataProviderMock.fetch)
          .calledWith({
            filter: { link: outputRequest.link },
          })
          .mockResolvedValueOnce({
            total: 1,
            items: [getOutputDataObject()],
          });

        await expect(outputs.create(outputRequest)).rejects.toThrow(
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

    describe('Authors', () => {
      test('Should throw when cannot create an external user', async () => {
        externalUserDataProviderMock.create.mockRejectedValueOnce(
          new GenericError(),
        );

        await expect(
          outputs.create({
            ...getOutputCreateData(),
            authors: [{ externalUserName: 'Chris Blue' }],
          }),
        ).rejects.toThrow(GenericError);
      });

      test('Should create a new external user and associate with the output', async () => {
        const externalUserId = 'external-user-id-1';
        externalUserDataProviderMock.create.mockResolvedValueOnce(
          externalUserId,
        );

        await outputs.create({
          ...getOutputCreateData(),
          authors: [{ externalUserName: 'Chris Blue' }],
        });

        expect(externalUserDataProviderMock.create).toBeCalledWith({
          name: 'Chris Blue',
        });
        expect(outputDataProviderMock.create).toBeCalledWith(
          expect.objectContaining({
            authors: [
              {
                externalUserId,
              },
            ],
          }),
        );
      });
    });

    test('Should create the new output and return it', async () => {
      const mockDate = new Date('2010-01-01');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const outputCreateData = getOutputCreateData();
      const outputId = 'output-id-1';
      outputDataProviderMock.create.mockResolvedValueOnce(outputId);

      const result = await outputs.create(outputCreateData);

      expect(result).toEqual(getOutputResponse());

      const outputCreateDataObject = getOutputCreateDataObject();
      expect(outputDataProviderMock.create).toHaveBeenCalledWith({
        ...outputCreateDataObject,
        addedDate: mockDate.toISOString(),
      });
    });
  });

  describe('Update method', () => {
    const outputId = 'updated-output-id';

    beforeEach(() => {
      const outputDataObject = getOutputDataObject();
      outputDataObject.id = outputId;
      outputDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [outputDataObject],
      });
      outputDataProviderMock.fetchById.mockResolvedValue(getOutputDataObject());
    });

    test('Should throw when fails to update the output', async () => {
      outputDataProviderMock.update.mockRejectedValueOnce(new GenericError());

      await expect(
        outputs.update(outputId, getOutputUpdateData()),
      ).rejects.toThrow(GenericError);
    });

    test('Should throw when existing addedDate can not be retrieved from a not found output', async () => {
      outputDataProviderMock.fetchById.mockResolvedValueOnce(null);

      await expect(
        outputs.update(outputId, getOutputUpdateData()),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should throw when the output does not exist', async () => {
      outputDataProviderMock.update.mockRejectedValueOnce(new NotFoundError());

      await expect(
        outputs.update(outputId, getOutputUpdateData()),
      ).rejects.toThrow(NotFoundError);
    });

    test('Should update the output and return it', async () => {
      const outputUpdateData = getOutputUpdateData();

      const result = await outputs.update(outputId, outputUpdateData);

      expect(result).toEqual(getOutputResponse());

      const outputUpdateDataObject = {
        ...getOutputUpdateDataObject(),
        versions: ['1'],
      };
      expect(outputDataProviderMock.update).toHaveBeenCalledWith(
        outputId,
        {
          ...outputUpdateDataObject,
        },
        { newVersion: undefined },
      );
    });

    describe('Validation', () => {
      describe('Validating uniqueness', () => {
        const outputDataObject = getOutputDataObject();
        outputDataObject.id = outputId;

        const outputRequest = getOutputUpdateData();
        outputRequest.title = 'some-test-title';
        outputRequest.link = 'https://some-test-link.com';

        test('Should throw an error when a different output with the same type and title already exists', async () => {
          const otherOutputDataObject = getOutputDataObject();
          otherOutputDataObject.id = 'another-output-id';
          // returns this output and another one with the same type and title
          when(outputDataProviderMock.fetch)
            .calledWith({
              filter: {
                title: outputRequest.title,
                documentType: [outputRequest.documentType],
              },
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [outputDataObject, otherOutputDataObject],
            });
          // returns this output only
          when(outputDataProviderMock.fetch)
            .calledWith({
              filter: { link: outputRequest.link },
            })
            .mockResolvedValueOnce({
              total: 1,
              items: [outputDataObject],
            });

          await expect(outputs.update(outputId, outputRequest)).rejects.toThrow(
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

        test('Should throw error when a output with the same link already exists', async () => {
          const otherOutputDataObject = getOutputDataObject();
          otherOutputDataObject.id = 'another-output-id';
          // returns this output and another one with the link
          when(outputDataProviderMock.fetch)
            .calledWith({
              filter: { link: outputRequest.link },
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [outputDataObject, otherOutputDataObject],
            });

          // returns this output only
          when(outputDataProviderMock.fetch)
            .calledWith({
              filter: {
                title: outputRequest.title,
                documentType: [outputRequest.documentType],
              },
            })
            .mockResolvedValueOnce({
              total: 1,
              items: [outputDataObject],
            });

          await expect(outputs.update(outputId, outputRequest)).rejects.toThrow(
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

        test('Should throw two validation errors when a output with the same type and title and link already exists', async () => {
          const otherOutputDataObject = getOutputDataObject();
          otherOutputDataObject.id = 'another-output-id';
          when(outputDataProviderMock.fetch)
            .calledWith({
              filter: {
                title: outputRequest.title,
                documentType: [outputRequest.documentType],
              },
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [outputDataObject, otherOutputDataObject],
            });
          when(outputDataProviderMock.fetch)
            .calledWith({
              filter: { link: outputRequest.link },
            })
            .mockResolvedValueOnce({
              total: 2,
              items: [outputDataObject, otherOutputDataObject],
            });

          await expect(outputs.update(outputId, outputRequest)).rejects.toThrow(
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
    });

    describe('Authors', () => {
      test('Should throw when cannot create an external user', async () => {
        externalUserDataProviderMock.create.mockRejectedValueOnce(
          new GenericError(),
        );

        await expect(
          outputs.update(outputId, {
            ...getOutputUpdateData(),
            authors: [{ externalUserName: 'Chris Blue' }],
          }),
        ).rejects.toThrow(GenericError);
      });

      test('Should create a new external user and associate with the output', async () => {
        const externalUserId = 'external-user-id-1';
        externalUserDataProviderMock.create.mockResolvedValueOnce(
          externalUserId,
        );

        await outputs.update(outputId, {
          ...getOutputUpdateData(),
          authors: [{ externalUserName: 'Chris Blue' }],
        });

        expect(externalUserDataProviderMock.create).toHaveBeenCalledWith({
          name: 'Chris Blue',
        });
        expect(outputDataProviderMock.update).toHaveBeenCalledWith(
          outputId,
          expect.objectContaining({
            authors: [
              {
                externalUserId,
              },
            ],
          }),
          { newVersion: undefined },
        );
      });
    });

    describe('Versioning', () => {
      test('Should create a new version when flag is set', async () => {
        const doi = '10.555/YFRU1371.121212';
        const rrid = 'RRID:AB_007358';
        const accessionNumber = 'NT_123456';
        outputDataProviderMock.fetchById.mockResolvedValueOnce({
          ...getOutputDataObject(),
          doi,
          rrid,
          accessionNumber,
        });

        await outputs.update(outputId, {
          ...getOutputUpdateData(),
          createVersion: true,
          link: 'https://newUniqueLink.com',
          title: 'new title',
          doi,
          rrid,
          accessionNumber,
        });
        expect(outputDataProviderMock.update).toHaveBeenCalledWith(
          outputId,
          expect.anything(),
          {
            newVersion: {
              documentType: 'Article',
              link: 'http://a.link',
              title: 'Test Proposal 1234',
              type: 'Research',
              addedDate: '2021-05-21T13:18:31.000Z',
              doi,
              rrid,
              accessionNumber,
            },
          },
        );
      });

      test('Should throw when trying to create a new version with the same link', async () => {
        const currentOutput = getOutputDataObject();
        const outputUpdateData = getOutputUpdateData();
        currentOutput.link = 'http://v1.com';
        outputDataProviderMock.fetchById.mockResolvedValue(currentOutput);

        await expect(
          outputs.update(outputId, {
            ...outputUpdateData,
            createVersion: true,
            link: currentOutput.link,
          }),
        ).rejects.toThrow(
          expect.objectContaining({
            data: [ERROR_UNIQUE_LINK],
          }),
        );
      });
    });
  });

  describe('Generate content method', () => {
    test('Should throw when fails to generate the content', async () => {
      generativeContentDataProviderMock.summariseContent.mockRejectedValueOnce(
        new GenericError(),
      );

      await expect(
        outputs.generateContent({
          description: 'description',
        }),
      ).rejects.toThrow(GenericError);
    });

    test('Should generate the content and return it', async () => {
      generativeContentDataProviderMock.summariseContent.mockResolvedValueOnce(
        'some summarised content',
      );

      const result = await outputs.generateContent({
        description: 'some description',
      });

      expect(result).toEqual({
        shortDescription: 'some summarised content',
      } satisfies Awaited<ReturnType<typeof outputs.generateContent>>);
      expect(
        generativeContentDataProviderMock.summariseContent,
      ).toHaveBeenCalledWith('some description');
    });

    test('Should return an empty string if no description was provided', async () => {
      const result = await outputs.generateContent({});

      expect(result).toEqual({
        shortDescription: '',
      } satisfies Awaited<ReturnType<typeof outputs.generateContent>>);
    });
  });
});
