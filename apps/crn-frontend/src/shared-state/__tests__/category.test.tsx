import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getCategories } from '../../shared-api/category';
import { useCategorySuggestions } from '../category';

jest.mock('../../shared-api/category');

const wrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback="loading">
    <Auth0Provider user={{ id: 'user-id' }}>
      <WhenReady>{children}</WhenReady>
    </Auth0Provider>
  </Suspense>
);

describe('useCategorySuggestions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getCategories with correct params and map the result', async () => {
    const mockItems = [
      { id: '1', name: 'Category A' },
      { id: '2', name: 'Category B' },
    ];

    (getCategories as jest.Mock).mockResolvedValue({ items: mockItems });

    const { result } = renderHook(() => useCategorySuggestions(), { wrapper });
    await waitFor(() => expect(result.current).toBeTruthy());

    let suggestions;
    await act(async () => {
      suggestions = await result.current('example search');
    });

    expect(getCategories).toHaveBeenCalledWith(
      { search: 'example search', take: 1000 },
      'Bearer access_token',
    );

    expect(suggestions).toEqual([
      { label: 'Category A', value: '1' },
      { label: 'Category B', value: '2' },
    ]);
  });

  it('should handle empty results', async () => {
    (getCategories as jest.Mock).mockResolvedValue({ items: [] });

    const { result } = renderHook(() => useCategorySuggestions(), { wrapper });
    await waitFor(() => expect(result.current).toBeTruthy());

    let suggestions;
    await act(async () => {
      suggestions = await result.current('any search');
    });

    expect(suggestions).toEqual([]);
  });
});
