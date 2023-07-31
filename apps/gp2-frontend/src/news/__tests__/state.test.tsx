import { renderHook } from '@testing-library/react-hooks';
import { RecoilRoot } from 'recoil';
import React from 'react';
import { gp2 } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { getNewsById } from '../api';
import { useNewsById } from '../state';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';

jest.mock('../api');

const mockGetNewsById = getNewsById as jest.MockedFunction<typeof getNewsById>;

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

    const newsItem = await result.current;

    expect(newsItem).toEqual(item);
  });
});
