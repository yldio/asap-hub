import { Router, StaticRouter } from 'react-router-dom';
import { renderHook } from '@testing-library/react-hooks/server';
import { createMemoryHistory } from 'history';
import { searchQueryParam } from '@asap-hub/routing';

import {
  queryParamString,
  useHasRouter,
  usePushFromHere,
  usePushFromPathname,
} from '../routing';

describe('queryParamString', () => {
  it('appends the search query param', () => {
    expect(
      new URLSearchParams(queryParamString('searchterm')).get(searchQueryParam),
    ).toBe('searchterm');
  });

  it('returns an empty string if no query params needed', () => {
    expect(queryParamString(undefined)).toBe('');
  });
});

describe('useHasRouter', () => {
  it('returns false if there is no Router context', () => {
    const {
      result: { current },
    } = renderHook(useHasRouter);
    expect(current).toBe(false);
  });

  it('returns true if there is a Router context', () => {
    const {
      result: { current },
    } = renderHook(useHasRouter, { wrapper: StaticRouter });
    expect(current).toBe(true);
  });
});

describe('usePushFromPathname', () => {
  it('pushes a history entry if currently on given page', () => {
    const history = createMemoryHistory({ initialEntries: ['/current'] });
    const wrapper: React.FC = ({ children }) => (
      <Router history={history}>{children}</Router>
    );
    const {
      result: { current },
    } = renderHook(() => usePushFromPathname('/current'), {
      wrapper,
    });

    current('/new');
    expect(history.location.pathname).toBe('/new');
  });

  it('does not push a history entry if currently on a different page', () => {
    const history = createMemoryHistory({ initialEntries: ['/current'] });
    const wrapper: React.FC = ({ children }) => (
      <Router history={history}>{children}</Router>
    );
    const {
      result: { current },
    } = renderHook(() => usePushFromPathname('/wrong'), {
      wrapper,
    });

    current('/new');
    expect(history.location.pathname).toBe('/current');
  });
});

describe('usePushFromHere', () => {
  it('pushes a history entry if still on the same page', () => {
    const history = createMemoryHistory({ initialEntries: ['/current'] });
    const wrapper: React.FC = ({ children }) => (
      <Router history={history}>{children}</Router>
    );
    const {
      result: { current },
    } = renderHook(() => usePushFromHere(), {
      wrapper,
    });

    current('/new');
    expect(history.location.pathname).toBe('/new');
  });

  it('does not push a history entry if no longer on the same page', () => {
    const history = createMemoryHistory({ initialEntries: ['/current'] });
    const wrapper: React.FC = ({ children }) => (
      <Router history={history}>{children}</Router>
    );
    const {
      result: { current },
    } = renderHook(() => usePushFromHere(), {
      wrapper,
    });

    history.push('/elsewhere');

    // Note that `current` is still the hook result from before the push;
    // now the hook is returning a function "bound" to `/elsewhere`.
    current('/new');
    expect(history.location.pathname).toBe('/elsewhere');
  });
});
