import { act, renderHook } from '@testing-library/react-hooks';
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil';
import { gp2 } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { getNews } from '../api';
import { newsListState, newsItemState } from '../state';

jest.mock('../api');

const mockGetNews = getNews as jest.MockedFunction<typeof getNews>;

const news: gp2Model.NewsResponse = {
  id: 'uuid-1',
  created: '2020-09-07T17:36:54Z',
  title: 'News Title',
  type: 'news',
  shortText: 'short text',
};

beforeEach(jest.resetAllMocks);
describe('newsListState', () => {
  it('should be updated when news item is updated', async () => {
    const options: GetListOptions = {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      filters: new Set(),
    };

    mockGetNews.mockResolvedValueOnce({ items: [news], total: 1 });

    const { result } = renderHook(
      () => ({
        newsListState: useRecoilState(newsListState(options)),
        newsItemState: useSetRecoilState(newsItemState(news.id)),
      }),
      {
        wrapper: RecoilRoot,
      },
    );

    const setNewsList = result.current.newsListState[1];
    const setItemState = result.current.newsItemState;

    await act(() => mockGetNews(options, '').then(setNewsList));
    const oldNewsList = result.current
      .newsListState[0] as gp2Model.ListNewsResponse;
    expect(oldNewsList.items.length).toBe(1);

    act(() => setItemState(undefined));
    const newNewsList = result.current
      .newsListState[0] as gp2Model.ListNewsResponse;
    expect(newNewsList.items.length).toBe(0);
  });

  it('can be set to undefined', async () => {
    const options: GetListOptions = {
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      filters: new Set(),
    };

    mockGetNews.mockResolvedValue(gp2.createListNewsResponse(2, 2));

    const { result } = renderHook(
      () => useRecoilState(newsListState(options)),
      {
        wrapper: RecoilRoot,
      },
    );

    const setNewsList = result.current[1];
    await act(() => mockGetNews(options, '').then(setNewsList));
    expect(result.current[0]).toBeDefined();

    act(() => setNewsList(undefined));
    expect(result.current[0]).not.toBeDefined();
  });
});
