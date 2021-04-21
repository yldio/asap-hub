import React from 'react';
import { act, render } from '@testing-library/react';

import SearchField from '../SearchField';
import { SEARCH_EVENT, SEARCH_QUERY_KEY } from '../../analytics';

jest.useFakeTimers('modern');

it('renders a search field, passing through props', () => {
  const { getByRole } = render(<SearchField placeholder="test" value="" />);
  expect(getByRole('searchbox')).toHaveAttribute('placeholder', 'test');
});

describe('GTM data', () => {
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

  it('is not pushed immediately after changing the query', () => {
    const { rerender } = render(<SearchField placeholder="p" value="" />);
    rerender(<SearchField placeholder="p" value="q" />);
    expect(window.dataLayer?.reduce(Object.assign)).not.toHaveProperty(
      SEARCH_QUERY_KEY,
      expect.anything(),
    );
  });
  it('is pushed after changing the query and waiting for a debounce', () => {
    const { rerender } = render(<SearchField placeholder="p" value="" />);
    rerender(<SearchField placeholder="p" value="q" />);
    act(() => {
      jest.advanceTimersByTime(30 * 1000);
    });
    expect(window.dataLayer?.reduce(Object.assign)).toMatchObject({
      [SEARCH_QUERY_KEY]: 'q',
      event: SEARCH_EVENT,
    });
  });

  it('is not pushed after changing the query to be empty', () => {
    const { rerender } = render(<SearchField placeholder="p" value="q" />);
    rerender(<SearchField placeholder="p" value="" />);
    act(() => {
      jest.advanceTimersByTime(30 * 1000);
    });
    expect(window.dataLayer?.reduce(Object.assign)).not.toHaveProperty(
      SEARCH_QUERY_KEY,
      expect.anything(),
    );
  });
  it('is reset immediately after changing the query to be empty', () => {
    const { rerender } = render(<SearchField placeholder="p" value="q" />);
    rerender(<SearchField placeholder="p" value="" />);
    expect(window.dataLayer?.reduce(Object.assign)).not.toHaveProperty(
      SEARCH_QUERY_KEY,
      expect.anything(),
    );
  });

  it('is reset after unmount', () => {
    const { unmount } = render(<SearchField placeholder="p" value="q" />);
    unmount();
    expect(window.dataLayer?.reduce(Object.assign)).not.toHaveProperty(
      SEARCH_QUERY_KEY,
      expect.anything(),
    );
  });
});
