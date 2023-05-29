import { searchQueryParam } from '@asap-hub/routing';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter, useHistory } from 'react-router-dom';
import { usePagination, usePaginationParams } from '../pagination';
import { useSearch } from '../search';

describe('useSearch', () => {
  describe('property filters', () => {
    it('defaults to empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
      });
      expect(result.current.filters).toEqual({
        keywords: [],
        regions: [],
        projects: [],
        workingGroups: [],
      });
    });

    describe.each`
      name               | value                | queryParam
      ${'regions'}       | ${'Asia'}            | ${'region'}
      ${'keywords'}      | ${'Aging'}           | ${'keyword'}
      ${'projects'}      | ${'project 1'}       | ${'project'}
      ${'workingGroups'} | ${'working group 1'} | ${'working-group'}
    `('single filters for $name', ({ name, value, queryParam }) => {
      it('is taken from the query param', () => {
        const { result } = renderHook(() => useSearch(), {
          wrapper: MemoryRouter,
          initialProps: {
            initialEntries: [`/test?${queryParam}=${value}`],
          },
        });
        expect(result.current.filters).toEqual({
          regions: [],
          keywords: [],
          projects: [],
          workingGroups: [],
          [name]: [value],
        });
      });
      it('can add a filter', () => {
        const { result } = renderHook(() => useSearch(), {
          wrapper: MemoryRouter,
          initialProps: {
            initialEntries: ['/test'],
          },
        });
        result.current.updateFilters('/test', { [name]: [value] });
        expect(result.current.filters).toEqual({
          keywords: [],
          regions: [],
          projects: [],
          workingGroups: [],
          [name]: [value],
        });
      });
      it('resets the pagination when changed', () => {
        const { result } = renderHook(
          () => ({
            useSearch: useSearch(),
            usePaginationParams: usePaginationParams(),
            usePagination: usePagination(50, 1),
          }),
          {
            wrapper: MemoryRouter,
            initialProps: {
              initialEntries: [`/test?${queryParam}=${value}&currentPage=2`],
            },
          },
        );
        expect(result.current.usePaginationParams.currentPage).toBe(2);
        result.current.useSearch.updateFilters('/test', {});
        expect(result.current.usePaginationParams.currentPage).toBe(0);
      });
    });

    describe.each`
      name               | firstValue           | secondValue          | queryParam
      ${'keywords'}      | ${'Aging'}           | ${'RNA'}             | ${'keyword'}
      ${'regions'}       | ${'Asia'}            | ${'Europe'}          | ${'region'}
      ${'projects'}      | ${'project 1'}       | ${'project 2'}       | ${'project'}
      ${'workingGroups'} | ${'working group 1'} | ${'working group 2'} | ${'working-group'}
    `('multiple filters', ({ name, firstValue, secondValue, queryParam }) => {
      it('can handle multiple filters', () => {
        const { result } = renderHook(() => useSearch(), {
          wrapper: MemoryRouter,
          initialProps: {
            initialEntries: [
              `/test?${queryParam}=${firstValue}&${queryParam}=${secondValue}`,
            ],
          },
        });
        expect(result.current.filters).toEqual({
          keywords: [],
          regions: [],
          projects: [],
          workingGroups: [],
          [name]: [firstValue, secondValue],
        });
      });
      it('can add multiple filters', () => {
        const { result } = renderHook(() => useSearch(), {
          wrapper: MemoryRouter,
          initialProps: {
            initialEntries: ['/test'],
          },
        });
        result.current.updateFilters('/test', {
          [name]: [firstValue, secondValue],
        });
        expect(result.current.filters).toEqual({
          keywords: [],
          regions: [],
          projects: [],
          workingGroups: [],
          [name]: [firstValue, secondValue],
        });
      });
      it('can add a filter', () => {
        const { result } = renderHook(() => useSearch(), {
          wrapper: MemoryRouter,
          initialProps: {
            initialEntries: [`/test?${queryParam}=${firstValue}`],
          },
        });
        result.current.updateFilters('/test', {
          [name]: [firstValue, secondValue],
        });
        expect(result.current.filters).toEqual({
          keywords: [],
          regions: [],
          projects: [],
          workingGroups: [],
          [name]: [firstValue, secondValue],
        });
      });
    });
  });
  describe.each`
    name               | value                | queryParam
    ${'regions'}       | ${'Asia'}            | ${'region'}
    ${'keywords'}      | ${'Aging'}           | ${'keyword'}
    ${'projects'}      | ${'a-project'}       | ${'project'}
    ${'workingGroups'} | ${'a-working-group'} | ${'working-group'}
  `('changeLocation for $name', ({ name, value, queryParam }) => {
    it('changes location without clearing the filters', () => {
      const { result } = renderHook(
        () => ({ useSearch: useSearch(), useHistory: useHistory() }),
        {
          wrapper: MemoryRouter,
          initialProps: {
            initialEntries: [`/test?${queryParam}=${value}`],
          },
        },
      );
      jest.spyOn(result.current.useHistory, 'push');
      expect(result.current.useSearch.filters).toEqual({
        keywords: [],
        regions: [],
        projects: [],
        workingGroups: [],
        [name]: [value],
      });
      result.current.useSearch.changeLocation('/test2');
      expect(result.current.useSearch.filters).toEqual({
        keywords: [],
        regions: [],
        projects: [],
        workingGroups: [],
        [name]: [value],
      });
      expect(result.current.useHistory.push).toHaveBeenCalledWith({
        pathname: '/test2',
        search: `${queryParam}=${value}`,
      });
    });
  });
  describe('property searchQuery', () => {
    it('defaults to empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
      });
      expect(result.current.searchQuery).toEqual('');
    });

    it('is taken from the query param', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: [`/test?${searchQueryParam}=test123`],
        },
      });
      expect(result.current.searchQuery).toEqual('test123');
    });

    it('can be changed', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test'],
        },
      });
      result.current.setSearchQuery('test123');
      expect(result.current.searchQuery).toEqual('test123');
    });

    it('can be removed', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: MemoryRouter,
        initialProps: {
          initialEntries: ['/test?searchQuery=test123'],
        },
      });
      result.current.setSearchQuery('');
      expect(result.current.searchQuery).toEqual('');
    });

    it('resets pagination when changed', () => {
      const { result } = renderHook(
        () => ({
          useSearch: useSearch(),
          usePaginationParams: usePaginationParams(),
          usePagination: usePagination(50, 1),
        }),
        {
          wrapper: MemoryRouter,
          initialProps: {
            initialEntries: ['/test?currentPage=2'],
          },
        },
      );
      expect(result.current.usePaginationParams.currentPage).toBe(2);
      result.current.useSearch.setSearchQuery('test123');
      expect(result.current.usePaginationParams.currentPage).toBe(0);
    });
  });
});
