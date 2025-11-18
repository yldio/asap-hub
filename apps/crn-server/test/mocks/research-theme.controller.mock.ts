import ResearchThemeController from '../../src/controllers/research-theme.controller';

export const researchThemeControllerMock: jest.Mocked<ResearchThemeController> =
  {
    fetch: jest.fn(),
  } as unknown as jest.Mocked<ResearchThemeController>;
