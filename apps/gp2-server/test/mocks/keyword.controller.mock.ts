import KeywordController from '../../src/controllers/keyword.controller';

export const keywordControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<KeywordController>;
