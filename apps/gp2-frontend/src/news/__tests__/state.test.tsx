import { act, renderHook } from '@testing-library/react-hooks';
import { RecoilRoot, useRecoilState } from 'recoil';
import React from 'react';
import { gp2 } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { getNewsById, getNews } from '../api';
import { useNewsById, newsListState } from '../state';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

jest.mock('../api');

const mockGetNewsById = getNewsById as jest.MockedFunction<typeof getNewsById>;
const mockGetNews = getNews as jest.MockedFunction<typeof getNews>;

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
    const newsResponse = gp2.createNewsResponse();
    const { items } = newsResponse;
    const item = items[0] as gp2Model.NewsDataObject;
    mockGetNewsById.mockResolvedValueOnce(item);
    const { result, waitForNextUpdate } = renderHook(
      () => useNewsById(item.id),
      { wrapper },
    );
    await waitForNextUpdate();

    const newsItem = result.current;

    expect(newsItem).toEqual(item);
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
