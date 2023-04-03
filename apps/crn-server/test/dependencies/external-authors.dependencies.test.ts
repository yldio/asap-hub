const mockExternalAuthorSquidexDataProvider = jest.fn();
const mockExternalAuthorContentfulDataProvider = jest.fn();

jest.mock('../../src/data-providers/external-authors.data-provider', () => ({
  ExternalAuthorSquidexDataProvider: jest
    .fn()
    .mockImplementation(() => mockExternalAuthorSquidexDataProvider),
}));
jest.mock(
  '../../src/data-providers/contentful/external-authors.data-provider',
  () => ({
    ExternalAuthorContentfulDataProvider: jest
      .fn()
      .mockImplementation(() => mockExternalAuthorContentfulDataProvider),
  }),
);

describe('External Authors Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('Should resolve External-Author Squidex Data Provider when the Contentful feature flag is off', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

    const getExternalAuthorDataProviderModule = await import(
      '../../src/dependencies/external-authors.dependencies'
    );
    const externalAuthorDataProvider =
      getExternalAuthorDataProviderModule.getExternalAuthorDataProvider();

    expect(externalAuthorDataProvider).toEqual(
      mockExternalAuthorSquidexDataProvider,
    );
  });

  it('Should resolve External-Author Squidex Data Provider when the Contentful feature flag is off', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';

    const getExternalAuthorDataProviderModule = await import(
      '../../src/dependencies/external-authors.dependencies'
    );
    const externalAuthorDataProvider =
      getExternalAuthorDataProviderModule.getExternalAuthorDataProvider();

    expect(externalAuthorDataProvider).toEqual(
      mockExternalAuthorContentfulDataProvider,
    );
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
