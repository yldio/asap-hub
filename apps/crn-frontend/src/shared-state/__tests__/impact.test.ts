import { act, renderHook } from '@testing-library/react';
import { getImpacts } from '../../shared-api/impact';
import { useImpactSuggestions } from '../impact';

jest.mock('@asap-hub/react-context', () => ({
  useAuth0CRN: () => ({
    getTokenSilently: jest.fn().mockResolvedValue('mock-token'),
  }),
}));
jest.mock('../../shared-api/impact');

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

    const { result } = renderHook(() => useImpactSuggestions());

    let suggestions;
    await act(async () => {
      suggestions = await result.current('example search');
    });

    expect(getImpacts).toHaveBeenCalledWith(
      { search: 'example search', take: 1000 },
      'Bearer mock-token',
    );

    expect(suggestions).toEqual([
      { label: 'Impact A', value: '1' },
      { label: 'Impact B', value: '2' },
    ]);
  });

  it('should handle empty results', async () => {
    (getImpacts as jest.Mock).mockResolvedValue({ items: [] });

    const { result } = renderHook(() => useImpactSuggestions());

    let suggestions;
    await act(async () => {
      suggestions = await result.current('any search');
    });

    expect(suggestions).toEqual([]);
  });
});
