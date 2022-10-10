import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Filter from '../Filter';
import { FILTERS_KEY, FILTER_EVENT } from '../../analytics';

it('shows and hides the dropdown menu', () => {
  const { getByRole, getByText } = render(
    <Filter
      filterOptions={[
        { label: 'Filter by Stuff' },
        { label: 'F1', value: 'f1' },
      ]}
    />,
  );
  const filterButton = getByRole('button');

  userEvent.click(filterButton);
  expect(getByText('Filter by Stuff')).toBeVisible();

  userEvent.click(filterButton);
  expect(getByText('Filter by Stuff')).not.toBeVisible();
});

it('hides the dropdown menu when the options changes', () => {
  const { rerender, getByRole, getByText } = render(
    <Filter filterOptions={[{ label: 'F1', value: 'f1' }]} />,
  );
  userEvent.click(getByRole('button'));
  expect(getByText('F1')).toBeVisible();

  rerender(<Filter filterOptions={[{ label: 'F2', value: 'f2' }]} />);
  expect(getByText('F2')).not.toBeVisible();
});

describe('GTM data', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    Object.defineProperty(window, 'dataLayer', {
      configurable: true,
      value: [],
    });
  });
  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).dataLayer;
  });

  it('is not pushed immediately after changing the filters', () => {
    const { rerender } = render(
      <Filter filterOptions={[{ value: 'f1', label: 'F1' }]} />,
    );
    rerender(
      <Filter
        filterOptions={[{ value: 'f1', label: 'F1' }]}
        filters={new Set(['f1'])}
      />,
    );
    expect(window.dataLayer?.reduce(Object.assign)).not.toHaveProperty(
      FILTERS_KEY,
      expect.anything(),
    );
  });
  it('is pushed after changing the query and waiting for a debounce', () => {
    const { rerender } = render(
      <Filter filterOptions={[{ value: 'f1', label: 'F1' }]} />,
    );
    rerender(
      <Filter
        filterOptions={[{ value: 'f1', label: 'F1' }]}
        filters={new Set(['f1'])}
      />,
    );
    act(() => {
      jest.advanceTimersByTime(30 * 1000);
    });
    expect(window.dataLayer?.reduce(Object.assign)).toMatchObject({
      [FILTERS_KEY]: ['f1'],
      event: FILTER_EVENT,
    });
  });

  it('is not pushed after changing the query to be empty', () => {
    const { rerender } = render(
      <Filter
        filterOptions={[{ value: 'f1', label: 'F1' }]}
        filters={new Set(['f1'])}
      />,
    );
    rerender(
      <Filter
        filterOptions={[{ value: 'f1', label: 'F1' }]}
        filters={new Set<string>()}
      />,
    );
    act(() => {
      jest.advanceTimersByTime(30 * 1000);
    });
    expect(window.dataLayer?.reduce(Object.assign)).not.toHaveProperty(
      FILTER_EVENT,
    );
  });
  it('is reset immediately after changing the query to be empty', () => {
    const { rerender } = render(
      <Filter
        filterOptions={[{ value: 'f1', label: 'F1' }]}
        filters={new Set(['f1'])}
      />,
    );
    rerender(
      <Filter
        filterOptions={[{ value: 'f1', label: 'F1' }]}
        filters={new Set<string>()}
      />,
    );
    expect(window.dataLayer?.reduce(Object.assign)).not.toHaveProperty(
      FILTERS_KEY,
      expect.anything(),
    );
  });

  it('is reset after unmount', () => {
    const { unmount } = render(
      <Filter filterOptions={[{ value: 'f1', label: 'F1' }]} />,
    );
    unmount();
    expect(window.dataLayer?.reduce(Object.assign)).not.toHaveProperty(
      FILTERS_KEY,
      expect.anything(),
    );
  });
});
