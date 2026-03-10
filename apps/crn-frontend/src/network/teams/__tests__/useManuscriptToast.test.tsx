import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { useManuscriptToast } from '../useManuscriptToast';
import {
  ManuscriptToastContext,
  ManuscriptToastProvider,
} from '../ManuscriptToastProvider';

describe('useManuscriptToast', () => {
  it('returns setFormType when used within ManuscriptToastProvider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ManuscriptToastProvider>{children}</ManuscriptToastProvider>
    );
    const { result } = renderHook(() => useManuscriptToast(), { wrapper });
    expect(result.current.setFormType).toBeDefined();
    expect(typeof result.current.setFormType).toBe('function');
  });

  it('returns default no-op setFormType when used outside ManuscriptToastProvider', () => {
    const { result } = renderHook(() => useManuscriptToast());
    expect(result.current.setFormType).toBeDefined();
    expect(typeof result.current.setFormType).toBe('function');
  });

  it('logs error when context has no setFormType', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ManuscriptToastContext.Provider
        value={{ setFormType: undefined as never }}
      >
        {children}
      </ManuscriptToastContext.Provider>
    );
    renderHook(() => useManuscriptToast(), { wrapper });
    expect(consoleSpy).toHaveBeenCalledWith(
      'useManuscriptToast must be used within a ManuscriptToastProvider',
    );
    consoleSpy.mockRestore();
  });
});
