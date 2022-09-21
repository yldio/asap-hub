import { renderHook } from '@testing-library/react-hooks/server';

import { useGifReplay, usePrevious, useIsMounted } from '../hooks';

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

describe('usePrevious', () => {
  it('initially returns undefined', () => {
    const { result } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });
    expect(result.current).toEqual(undefined);
  });

  it('returns previous result', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });
    rerender({ value: 2 });
    expect(result.current).toEqual(1);
    rerender({ value: 3 });
    expect(result.current).toEqual(2);
  });
});

describe('useIsMounted', () => {
  it('initially returns true in a ref', () => {
    const { result } = renderHook(useIsMounted);
    expect(result.current.current).toBe(true);
  });

  it('return false in a ref once unmounted', () => {
    const { result, unmount } = renderHook(useIsMounted);
    unmount();
    expect(result.current.current).toBe(false);
  });
});
