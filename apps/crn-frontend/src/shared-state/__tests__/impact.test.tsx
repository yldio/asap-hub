import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getImpacts } from '../../shared-api/impact';
import { useImpactSuggestions } from '../impact';

jest.mock('../../shared-api/impact');

const wrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback="loading">
    <Auth0Provider user={{ id: 'user-id' }}>
      <WhenReady>{children}</WhenReady>
    </Auth0Provider>
  </Suspense>
);

describe('useImpactSuggestions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getImpacts with correct params and map the result', async () => {
    const mockItems = [
      { id: '1', name: 'Impact A' },
      { id: '2', name: 'Impact B' },
    ];

    (getImpacts as jest.Mock).mockResolvedValue({ items: mockItems });

    const { result } = renderHook(() => useImpactSuggestions(), { wrapper });
    await waitFor(() => expect(result.current).toBeTruthy());

    let suggestions;
    await act(async () => {
      suggestions = await result.current('example search');
    });

    expect(getImpacts).toHaveBeenCalledWith(
      { search: 'example search', take: 1000 },
      'Bearer access_token',
    );

    expect(suggestions).toEqual([
      { label: 'Impact A', value: '1' },
      { label: 'Impact B', value: '2' },
    ]);
  });

  it('should handle empty results', async () => {
    (getImpacts as jest.Mock).mockResolvedValue({ items: [] });

    const { result } = renderHook(() => useImpactSuggestions(), { wrapper });
    await waitFor(() => expect(result.current).toBeTruthy());

    let suggestions;
    await act(async () => {
      suggestions = await result.current('any search');
    });

    expect(suggestions).toEqual([]);
  });
});
