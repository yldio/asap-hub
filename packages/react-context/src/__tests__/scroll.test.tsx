import { renderHook } from '@testing-library/react';
import { ScrollContext, useScrollToTop } from '..';

it('returns scrollToTop from context provider', () => {
  const scrollToTop = jest.fn();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ScrollContext.Provider value={{ scrollToTop }}>
      {children}
    </ScrollContext.Provider>
  );

  const { result } = renderHook(() => useScrollToTop(), { wrapper });

  result.current.scrollToTop();

  expect(scrollToTop).toHaveBeenCalled();
});

it('uses default scrollToTop when no provider is present', () => {
  const { result } = renderHook(() => useScrollToTop());

  expect(typeof result.current.scrollToTop).toBe('function');

  expect(() => result.current.scrollToTop()).not.toThrow();
});
