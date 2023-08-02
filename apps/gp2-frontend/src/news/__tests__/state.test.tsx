import { act, renderHook } from '@testing-library/react-hooks';
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil';
import React from 'react';
import { gp2 } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { getNewsById, getNews } from '../api';
import { useNewsById, newsListState, newsItemState } from '../state';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

jest.mock('../api');

const mockGetNewsById = getNewsById as jest.MockedFunction<typeof getNewsById>;
const mockGetNews = getNews as jest.MockedFunction<typeof getNews>;

const news: gp2Model.NewsResponse = {
  id: 'uuid-1',
  created: '2020-09-07T17:36:54Z',
  title: 'News Title',
  type: 'news',
  shortText: 'short text',
};

const wrapper: React.FC = ({ children }) => (
  <RecoilRoot>
    <Auth0Provider user={{}}>
      <WhenReady>{children}</WhenReady>
    </Auth0Provider>
  </RecoilRoot>
);

beforeEach(jest.resetAllMocks);
describe('useNewsById', () => {
  it('should return a news item given an id', async () => {
    mockGetNewsById.mockResolvedValueOnce(news);
    const { result, waitForNextUpdate } = renderHook(
      () => useNewsById(news.id),
      { wrapper },
    );
    await waitForNextUpdate();

    const newsItem = result.current;

    expect(newsItem).toEqual(news);
  });

  it('should update news item list', async () => {
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

  it('should not return a news item given an invalid id', async () => {
    mockGetNewsById.mockResolvedValueOnce(undefined);

    const { result, waitForNextUpdate } = renderHook(
      () => useNewsById(Math.random().toString()),
      { wrapper },
    );
    await waitForNextUpdate();

    const newsItem = result.current;

    expect(newsItem).toEqual(undefined);
  });

  it('should reset list to undefined', async () => {
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
