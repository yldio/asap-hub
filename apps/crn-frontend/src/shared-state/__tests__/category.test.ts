import { act, renderHook } from '@testing-library/react';
import { useRecoilValue } from 'recoil';
import { getCategories } from '../../shared-api/category';
import { useCategorySuggestions } from '../category';

jest.mock('recoil');
jest.mock('../../shared-api/category');

describe('useCategorySuggestions', () => {
  const mockAuthorization = 'mock-token';

  beforeEach(() => {
    (useRecoilValue as jest.Mock).mockReturnValue(mockAuthorization);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getCategories with correct params and map the result', async () => {
    const mockItems = [
      { id: '1', name: 'Category A' },
      { id: '2', name: 'Category B' },
    ];

    (getCategories as jest.Mock).mockResolvedValue({ items: mockItems });

    const { result } = renderHook(() => useCategorySuggestions());

    let suggestions;
    await act(async () => {
      suggestions = await result.current('example search');
    });

    expect(getCategories).toHaveBeenCalledWith(
      { search: 'example search', take: 1000 },
      mockAuthorization,
    );

    expect(suggestions).toEqual([
      { label: 'Category A', value: '1' },
      { label: 'Category B', value: '2' },
    ]);
  });

  it('should handle empty results', async () => {
    (getCategories as jest.Mock).mockResolvedValue({ items: [] });

    const { result } = renderHook(() => useCategorySuggestions());

    let suggestions;
    await act(async () => {
      suggestions = await result.current('any search');
    });

    expect(suggestions).toEqual([]);
  });
});
