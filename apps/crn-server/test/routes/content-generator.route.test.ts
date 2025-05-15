import supertest from 'supertest';
import { appFactory } from '../../src/app';
import ContentGeneratorController from '../../src/controllers/content-generator.controller';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';

export const contentGeneratorControllerMock = {
  generateContent: jest.fn(),
} as unknown as jest.Mocked<ContentGeneratorController>;

describe('POST /generate-content', () => {
  const app = appFactory({
    contentGeneratorController: contentGeneratorControllerMock,
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  test('Should return a 200 when is hit', async () => {
    const description = 'A very long description';
    contentGeneratorControllerMock.generateContent.mockResolvedValueOnce({
      shortDescription: 'short description',
    });

    const response = await supertest(app)
      .post('/generate-content')
      .send({ description })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(contentGeneratorControllerMock.generateContent).toHaveBeenCalledWith(
      {
        description,
      },
    );
  });
});
