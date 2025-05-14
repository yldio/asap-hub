import { ContentGeneratorResponse } from '@asap-hub/model';
import { GenericError } from '@asap-hub/errors';
import { GenerativeContentDataProvider } from '../../src/data-providers/contentful/generative-content.data-provider';
import ContentGeneratorController from '../../src/controllers/content-generator.controller';

describe('Generate content method', () => {
  const generativeContentDataProviderMock = {
    summariseContent: jest.fn(),
  } as unknown as jest.Mocked<GenerativeContentDataProvider>;

  const contentGeneratorController = new ContentGeneratorController(
    generativeContentDataProviderMock,
  );

  test('Should throw when fails to generate the content', async () => {
    generativeContentDataProviderMock.summariseContent.mockRejectedValueOnce(
      new GenericError(),
    );

    await expect(
      contentGeneratorController.generateContent({
        description: 'description',
      }),
    ).rejects.toThrow(GenericError);
  });

  test('Should generate the content and return it', async () => {
    generativeContentDataProviderMock.summariseContent.mockResolvedValueOnce(
      'some summarised content',
    );

    const result = await contentGeneratorController.generateContent({
      description: 'some description',
    });

    expect(result).toEqual({
      shortDescription: 'some summarised content',
    } satisfies ContentGeneratorResponse);
    expect(
      generativeContentDataProviderMock.summariseContent,
    ).toHaveBeenCalledWith('some description');
  });

  test('Should return an empty string if no description was provided', async () => {
    const result = await contentGeneratorController.generateContent({
      description: '',
    });

    expect(result).toEqual({
      shortDescription: '',
    } satisfies ContentGeneratorResponse);
  });
});
