import { renderHook, act } from '@testing-library/react';
import { useDismissable } from '../useDismissable';

const TEST_KEY = 'test-dismissable-key';

describe('useDismissable', () => {
  beforeEach(() => {
    localStorage.removeItem(TEST_KEY);
  });

  it('initializes with false when localStorage is empty', () => {
    const { result } = renderHook(() => useDismissable(TEST_KEY));

    expect(result.current[0]).toBe(false);
    expect(localStorage.getItem(TEST_KEY)).toBeNull();
  });

  it('initializes with true when localStorage has dismissed value', () => {
    localStorage.setItem(TEST_KEY, 'true');

    const { result } = renderHook(() => useDismissable(TEST_KEY));

    expect(result.current[0]).toBe(true);
  });

  it('initializes with false when localStorage has non-true value', () => {
    localStorage.setItem(TEST_KEY, 'false');

    const { result } = renderHook(() => useDismissable(TEST_KEY));

    expect(result.current[0]).toBe(false);
  });

  it('dismisses and updates localStorage', () => {
    const { result } = renderHook(() => useDismissable(TEST_KEY));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });

    expect(result.current[0]).toBe(true);
    expect(localStorage.getItem(TEST_KEY)).toBe('true');
  });

  it('persists dismissal across component remounts', () => {
    // First render - dismiss the item
    const { result: result1, unmount } = renderHook(() =>
      useDismissable(TEST_KEY),
    );

    expect(result1.current[0]).toBe(false);

    act(() => {
      result1.current[1]();
    });

    expect(result1.current[0]).toBe(true);
    expect(localStorage.getItem(TEST_KEY)).toBe('true');

    // Unmount and create a new hook instance (simulating component remount)
    unmount();

    // New hook instance should read from localStorage and be dismissed
    const { result: result2 } = renderHook(() => useDismissable(TEST_KEY));

    expect(result2.current[0]).toBe(true);
    expect(localStorage.getItem(TEST_KEY)).toBe('true');
  });

  it('uses different keys independently', () => {
    const KEY_1 = 'key-1';
    const KEY_2 = 'key-2';

    // Clean up any existing values
    localStorage.removeItem(KEY_1);
    localStorage.removeItem(KEY_2);

    const { result: result1 } = renderHook(() => useDismissable(KEY_1));
    const { result: result2 } = renderHook(() => useDismissable(KEY_2));

    expect(result1.current[0]).toBe(false);
    expect(result2.current[0]).toBe(false);

    act(() => {
      result1.current[1]();
    });

    expect(result1.current[0]).toBe(true);
    expect(result2.current[0]).toBe(false);
    expect(localStorage.getItem(KEY_1)).toBe('true');
    expect(localStorage.getItem(KEY_2)).toBeNull();

    // Cleanup
    localStorage.removeItem(KEY_1);
    localStorage.removeItem(KEY_2);
  });
});
