import {
  DEFAULT_COMPLETED_STATUS,
  DEFAULT_REQUESTED_APC_COVERAGE,
} from '@asap-hub/model';
import { searchQueryParam } from '@asap-hub/routing';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';
import { useComplianceSearch } from '../useComplianceSearch';

describe('useComplianceSearch', () => {
  it('returns default values when no URL params are present', () => {
    const { result } = renderHook(() => useComplianceSearch(), {
      wrapper: MemoryRouter,
    });

    expect(result.current).toMatchObject({
      completedStatus: DEFAULT_COMPLETED_STATUS,
      debouncedSearchQuery: '',
      requestedAPCCoverage: DEFAULT_REQUESTED_APC_COVERAGE,
      searchQuery: '',
      selectedStatuses: [],
    });
  });

  it('reads search query from URL', () => {
    const { result } = renderHook(() => useComplianceSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [`/?${searchQueryParam}=test query`],
      },
    });

    expect(result.current.searchQuery).toBe('test query');
  });

  it('reads completedStatus from URL', () => {
    const { result } = renderHook(() => useComplianceSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/?completedStatus=hide'],
      },
    });

    expect(result.current.completedStatus).toBe('hide');
  });

  it('reads requestedAPCCoverage from URL', () => {
    const { result } = renderHook(() => useComplianceSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: ['/?requestedAPCCoverage=submitted'],
      },
    });

    expect(result.current.requestedAPCCoverage).toBe('submitted');
  });

  it('reads selected statuses from URL', () => {
    const { result } = renderHook(() => useComplianceSearch(), {
      wrapper: MemoryRouter,
      initialProps: {
        initialEntries: [`/?status=Waiting+for+Report&status=Compliant`],
      },
    });

    expect(result.current.selectedStatuses).toEqual([
      'Waiting for Report',
      'Compliant',
    ]);
  });

  describe('setSearchQuery', () => {
    it('updates search query in URL', () => {
      const { result, rerender } = renderHook(() => useComplianceSearch(), {
        wrapper: MemoryRouter,
      });

      act(() => {
        result.current.setSearchQuery('new search');
      });

      rerender();

      expect(result.current.searchQuery).toBe('new search');
    });

    it('removes search param when query is empty', () => {
      const { result, rerender } = renderHook(() => useComplianceSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: [`/?${searchQueryParam}=initial`],
        },
      });

      act(() => {
        result.current.setSearchQuery('');
      });

      rerender();

      expect(result.current.searchQuery).toBe('');
    });
  });

  describe('setStatus', () => {
    it('adds status to URL when not present', () => {
      const { result, rerender } = renderHook(() => useComplianceSearch(), {
        wrapper: MemoryRouter,
      });

      act(() => {
        result.current.setStatus('Manuscript Resubmitted');
      });

      rerender();

      expect(result.current.selectedStatuses).toEqual([
        'Manuscript Resubmitted',
      ]);
    });

    it('removes status from URL when already present', () => {
      const { result, rerender } = renderHook(() => useComplianceSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/?status=Manuscript+Resubmitted'],
        },
      });

      act(() => {
        result.current.setStatus('Manuscript Resubmitted');
      });

      rerender();

      expect(result.current.selectedStatuses).toEqual([]);
    });

    it('preserves other statuses when removing one', () => {
      const { result, rerender } = renderHook(() => useComplianceSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: [`/?status=Waiting+for+Report&status=Compliant`],
        },
      });

      act(() => {
        result.current.setStatus('Compliant');
      });

      rerender();

      expect(result.current.selectedStatuses).toEqual(['Waiting for Report']);
    });
  });
});
