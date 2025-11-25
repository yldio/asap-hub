import { DEFAULT_COMPLETED_STATUS } from '@asap-hub/model';
import { searchQueryParam } from '@asap-hub/routing';
import { act, renderHook } from '@testing-library/react';
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

  /* eslint-disable-next-line jest/no-commented-out-tests */
  // it('reads requestedAPCCoverage from URL', () => {
  //   const { result } = renderHook(() => useComplianceSearch(), {
  //     wrapper: MemoryRouter,
  //     initialProps: {
  //       initialEntries: ['/?requestedAPCCoverage=submitted'],
  //     },
  //   });

  //   expect(result.current.requestedAPCCoverage).toBe('submitted');
  // });

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

describe('generateLinkFactory', () => {
  it('generates URL with given parameters', () => {
    const { result } = renderHook(() => useComplianceSearch(), {
      wrapper: MemoryRouter,
    });

    const url = result.current.generateLinkFactory(
      '/base-path',
      1,
      [],
      '',
    )('show', 'all');

    expect(url).toBe(
      '/base-path?completedStatus=show&currentPage=1&requestedAPCCoverage=all',
    );
  });

  it('includes all statuses when completedStatus is show', () => {
    const { result } = renderHook(() => useComplianceSearch(), {
      wrapper: MemoryRouter,
    });

    const url = result.current.generateLinkFactory(
      '/base-path',
      1,
      ['Compliant', 'Waiting for Report'],
      '',
    )('show', 'all');

    expect(url).toBe(
      `/base-path?completedStatus=show&currentPage=1&requestedAPCCoverage=all&status=Compliant&status=Waiting+for+Report`,
    );
  });

  it('filters out Compliant and Closed statuses when completedStatus is hide', () => {
    const { result } = renderHook(() => useComplianceSearch(), {
      wrapper: MemoryRouter,
    });

    const url = result.current.generateLinkFactory(
      '/base-path',
      1,
      ['Compliant', 'Waiting for Report', 'Closed (other)'],
      '',
    )('hide', 'all');

    expect(url).toBe(
      '/base-path?completedStatus=hide&currentPage=1&requestedAPCCoverage=all&status=Waiting+for+Report',
    );
  });

  it('combines all parameters correctly', () => {
    const { result } = renderHook(() => useComplianceSearch(), {
      wrapper: MemoryRouter,
    });

    const url = result.current.generateLinkFactory(
      '/base-path',
      2,
      ['Compliant', 'Waiting for Report', 'Manuscript Resubmitted'],
      'Alessi',
    )('hide', 'all');

    expect(url).toBe(
      '/base-path?completedStatus=hide&currentPage=2&searchQuery=Alessi&requestedAPCCoverage=all&status=Waiting+for+Report&status=Manuscript+Resubmitted',
    );
  });
});
