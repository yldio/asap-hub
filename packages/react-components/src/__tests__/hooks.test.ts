import { renderHook } from '@testing-library/react-hooks';
import { StaticRouter } from 'react-router-dom';

import { useGifReplay, useHasRouter } from '../hooks';

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

describe('useGifReplay', () => {
  it('returns the same GIF URL apart from the fragment', () => {
    const {
      result: { current },
    } = renderHook(() => useGifReplay('/meme.gif', []));
    expect(new URL(current, window.location.href).pathname).toEqual(
      '/meme.gif',
    );
  });

  it('changes the fragment when the dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ counter }) => useGifReplay('/meme.gif', [counter]),
      { initialProps: { counter: 1 } },
    );
    const oldFragment = new URL(result.current, window.location.href).hash;

    rerender({ counter: 2 });
    const newFragment = new URL(result.current, window.location.href).hash;

    expect(newFragment).not.toEqual(oldFragment);
  });

  it('does not change fragment when the dependencies remain unchanged', () => {
    const { result, rerender } = renderHook(
      ({ counter }) => useGifReplay('/meme.gif', [counter]),
      { initialProps: { counter: 1 } },
    );
    const oldFragment = new URL(result.current, window.location.href).hash;

    rerender({ counter: 1 });
    const newFragment = new URL(result.current, window.location.href).hash;

    expect(newFragment).toEqual(oldFragment);
  });
});
