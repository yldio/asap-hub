import { NotFoundError } from '@asap-hub/errors';
import Pages from '../../src/controllers/page.controller';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Page controller', () => {
  const pageDataProviderMock = getDataProviderMock();
  const pageController = new Pages(pageDataProviderMock);
  const mockPage = {
    id: 'some-id',
    path: '/privacy-policy',
    text: '<h1>Privacy Policy</h1>',
    shortText: 'short text',
    title: 'Privacy Policy',
    link: 'link',
    linkText: 'linkText',
  };

  describe('FetchByPath method', () => {
    test('Should throw a Not Found error when the page is not found', async () => {
      const path = '/not-found';

      pageDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });

      await expect(pageController.fetchByPath(path)).rejects.toThrow(
        NotFoundError,
      );
    });

    test('Should throw an error when more than a single page is returned', async () => {
      const path = '/page';

      pageDataProviderMock.fetch.mockResolvedValue({
        total: 2,
        items: [mockPage, mockPage],
      });

      await expect(pageController.fetchByPath(path)).rejects.toThrow(
        'More than one page was returned',
      );
    });

    test('Should return the result when the page exists', async () => {
      const path = '/page';

      pageDataProviderMock.fetch.mockResolvedValue({
        total: 1,
        items: [mockPage],
      });

      const result = await pageController.fetchByPath(path);

      expect(result).toEqual(mockPage);
    });
  });
});
