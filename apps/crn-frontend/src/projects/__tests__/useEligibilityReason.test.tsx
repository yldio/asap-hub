import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';

import { useEligibilityReason } from '../useEligibilityReason';
import { EligibilityReasonProvider } from '../../network/teams/EligibilityReasonProvider';

describe('useEligibilityReason', () => {
  it('returns eligibilityReasons and setEligibilityReasons when used within provider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <EligibilityReasonProvider>{children}</EligibilityReasonProvider>
    );
    const { result } = renderHook(() => useEligibilityReason(), { wrapper });
    expect(result.current.eligibilityReasons).toBeDefined();
    expect(result.current.setEligibilityReasons).toBeDefined();
  });

  it('returns empty set as initial eligibility reasons', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <EligibilityReasonProvider>{children}</EligibilityReasonProvider>
    );
    const { result } = renderHook(() => useEligibilityReason(), { wrapper });
    expect(result.current.eligibilityReasons.size).toBe(0);
  });

  it('updates eligibility reasons when setEligibilityReasons is called', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <EligibilityReasonProvider>{children}</EligibilityReasonProvider>
    );
    const { result } = renderHook(() => useEligibilityReason(), { wrapper });
    act(() => {
      result.current.setEligibilityReasons(new Set(['reason-1', 'reason-2']));
    });
    expect(result.current.eligibilityReasons.size).toBe(2);
    expect(result.current.eligibilityReasons.has('reason-1')).toBe(true);
    expect(result.current.eligibilityReasons.has('reason-2')).toBe(true);
  });
});
