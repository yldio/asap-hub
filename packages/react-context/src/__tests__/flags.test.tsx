import { renderHook, act } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';
import { isEnabled, disable } from '@asap-hub/flags';

import { useFlags, LiveFlagsProvider } from '../flags';

describe('useFlags', () => {
  it('provides the isEnabled flag method', () => {
    disable('PERSISTENT_EXAMPLE');
    const {
      result: { current },
    } = renderHook(useFlags);
    expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(false);
  });

  it('provides the disable flag method', () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.disable('PERSISTENT_EXAMPLE');
    expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(false);
  });

  it('provides the reset flags method', () => {
    disable('PERSISTENT_EXAMPLE');
    const {
      result: { current },
    } = renderHook(useFlags);
    current.reset();
    expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
  });
});

describe('LiveFlagsProvider', () => {
  const TestComponent: React.FC<{ index?: number }> = ({ index }) => {
    const flags = useFlags();
    return (
      <div>
        <p>
          {index} enabled: {String(flags.isEnabled('PERSISTENT_EXAMPLE'))}
        </p>
        <button onClick={() => flags.disable('PERSISTENT_EXAMPLE')}>
          disable {index}
        </button>
        <button onClick={flags.reset}>reset {index}</button>
      </div>
    );
  };

  it('updates a component on disable', () => {
    const { getByText } = render(<TestComponent />, {
      wrapper: LiveFlagsProvider,
    });
    expect(getByText('enabled: true')).toBeVisible();

    fireEvent.click(getByText('disable'));
    expect(getByText('enabled: false')).toBeVisible();
  });

  it('updates a component on reset', () => {
    disable('PERSISTENT_EXAMPLE');
    const { getByText } = render(<TestComponent />, {
      wrapper: LiveFlagsProvider,
    });
    expect(getByText('enabled: false')).toBeVisible();

    fireEvent.click(getByText('reset'));
    expect(getByText('enabled: true')).toBeVisible();
  });

  it('provides the same callback every time so that it can be used as an effect dependency', () => {
    const { result } = renderHook(useFlags, { wrapper: LiveFlagsProvider });
    const first = result.current;

    act(() => {
      result.current.disable('PERSISTENT_EXAMPLE');
    });
    const second = result.current;

    expect(first).not.toBe(second);
    expect(first.isEnabled).toBe(second.isEnabled);
    expect(first.disable).toBe(second.disable);
    expect(first.reset).toBe(second.reset);
  });
});
