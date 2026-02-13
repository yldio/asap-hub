import { renderHook } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useAnalytics } from '../analytics';

const renderUseAnalytics = (
  search = '',
  options?: Parameters<typeof useAnalytics>[0],
) =>
  renderHook(() => useAnalytics(options), {
    wrapper: ({ children }) =>
      React.createElement(
        MemoryRouter,
        {
          future: { v7_startTransition: true, v7_relativeSplatPath: true },
          initialEntries: [`/${search}`],
        },
        children,
      ),
  });

it('returns default options if no params and no default provided', () => {
  const { result } = renderUseAnalytics();

  expect(result.current).toEqual({
    timeRange: 'all',
    documentCategory: 'all',
    outputType: 'all',
  });
});

it('can read documentCategory and outputType from query params', () => {
  const { result } = renderUseAnalytics(
    '?documentCategory=article&outputType=dataset',
  );

  expect(result.current.documentCategory).toBe('article');
  expect(result.current.outputType).toBe('dataset');
});

it.each`
  search          | defaultRange   | expected
  ${''}           | ${undefined}   | ${'all'}
  ${''}           | ${'last-year'} | ${'last-year'}
  ${'?range=all'} | ${'last-year'} | ${'all'}
`('timeRange: $expected', ({ search, defaultRange, expected }) => {
  const { result } = renderUseAnalytics(search, {
    defaultTimeRange: defaultRange,
  });

  expect(result.current.timeRange).toBe(expected);
});
