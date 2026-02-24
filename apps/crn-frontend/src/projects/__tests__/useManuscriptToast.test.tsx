import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { useManuscriptToast } from '../useManuscriptToast';
import { ManuscriptToastProvider } from '../../network/teams/ManuscriptToastProvider';

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
});
