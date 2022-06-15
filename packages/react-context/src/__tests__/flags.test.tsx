import { renderHook, act } from '@testing-library/react-hooks';
import { render, fireEvent } from '@testing-library/react';
import { isEnabled, disable } from '@asap-hub/flags';

import { useFlags, LiveFlagsProvider } from '../flags';

const originalCookie = document.cookie;

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

  it('provides the enable flag method', () => {
    const {
      result: { current },
    } = renderHook(useFlags);
    current.enable('PERSISTENT_EXAMPLE');
    expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
  });

  it('provides the reset flags method', () => {
    disable('PERSISTENT_EXAMPLE');
    const {
      result: { current },
    } = renderHook(useFlags);
    current.reset();
    expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
  });

  it('overrides the feature flag if the cookie matches a valid feature flag', () => {
    disable('PERSISTENT_EXAMPLE');
    const {
      result: { current },
    } = renderHook(useFlags);

    expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(false);

    document.cookie = 'ASAP_PERSISTENT_EXAMPLE=2';
    current.setCurrentOverrides();
    expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(false);

    document.cookie = 'ASAP_PERSISTENT_EXAMPLE={}';
    current.setCurrentOverrides();
    expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(false);

    document.cookie = 'ASAP_PERSISTENT_EXAMPLE=[]';
    current.setCurrentOverrides();
    expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(false);

    document.cookie = "ASAP_PERSISTENT_EXAMPLE=''";
    current.setCurrentOverrides();
    expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(false);

    document.cookie = 'ASAP_PERSISTENT_EXAMPLE=True';
    current.setCurrentOverrides();
    expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(false);

    document.cookie = 'ASAP_PERSISTENT_EXAMPLE=true';
    current.setCurrentOverrides();
    expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(true);

    document.cookie = originalCookie;
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
        <button onClick={() => flags.enable('PERSISTENT_EXAMPLE')}>
          enable {index}
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

  it('updates a component on enable', () => {
    const { getByText } = render(<TestComponent />, {
      wrapper: LiveFlagsProvider,
    });

    fireEvent.click(getByText('disable'));
    expect(getByText('enabled: false')).toBeVisible();

    fireEvent.click(getByText('enable'));
    expect(getByText('enabled: true')).toBeVisible();
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
