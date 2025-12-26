import { MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { renderHook, waitFor } from '@testing-library/react';
import { searchQueryParam } from '@asap-hub/routing';
import { useEffect, act } from 'react';

import {
  queryParamString,
  useHasRouter,
  usePushFromHere,
  usePushFromPathname,
  useScrollToHash,
} from '../routing';

// Helper to capture location pathname in tests
let currentPathname: string | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentPathname = location.pathname;
  }, [location]);
  return null;
};

// Helper to trigger navigation in tests
let navigateToPath: ReturnType<typeof useNavigate> | null = null;
const NavigationHelper = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigateToPath = navigate;
    return () => {
      navigateToPath = null;
    };
  }, [navigate]);
  return null;
};

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
  it('pushes a history entry if currently on given page', async () => {
    currentPathname = null;
    const wrapper: React.FC = ({ children }) => (
      <MemoryRouter initialEntries={['/current']}>
        <LocationCapture />
        {children}
      </MemoryRouter>
    );
    const {
      result: { current },
    } = renderHook(() => usePushFromPathname('/current'), {
      wrapper,
    });

    act(() => {
      current('/new');
    });

    await waitFor(() => {
      expect(currentPathname).toBe('/new');
    });
  });

  it('does not push a history entry if currently on a different page', async () => {
    currentPathname = null;
    const wrapper: React.FC = ({ children }) => (
      <MemoryRouter initialEntries={['/current']}>
        <LocationCapture />
        {children}
      </MemoryRouter>
    );
    const {
      result: { current },
    } = renderHook(() => usePushFromPathname('/wrong'), {
      wrapper,
    });

    act(() => {
      current('/new');
    });

    // Should not navigate, so location should still be /current
    await waitFor(() => {
      expect(currentPathname).toBe('/current');
    });
  });
});

describe('usePushFromHere', () => {
  it('pushes a history entry if still on the same page', async () => {
    currentPathname = null;
    const wrapper: React.FC = ({ children }) => (
      <MemoryRouter initialEntries={['/current']}>
        <LocationCapture />
        {children}
      </MemoryRouter>
    );
    const {
      result: { current },
    } = renderHook(() => usePushFromHere(), {
      wrapper,
    });

    act(() => {
      current('/new');
    });

    await waitFor(() => {
      expect(currentPathname).toBe('/new');
    });
  });

  it('does not push a history entry if no longer on the same page', async () => {
    currentPathname = null;
    navigateToPath = null;
    const wrapper: React.FC = ({ children }) => (
      <MemoryRouter initialEntries={['/current']}>
        <LocationCapture />
        <NavigationHelper />
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => usePushFromHere(), {
      wrapper,
    });

    // Save the function returned when we were at /current
    const pushFromCurrent = result.current;

    act(() => {
      navigateToPath?.('/elsewhere');
    });

    await waitFor(() => {
      expect(currentPathname).toBe('/elsewhere');
    });

    // Note that `pushFromCurrent` is still the hook result from before the push;
    // it's a function "bound" to `/current`, so calling it when we're at `/elsewhere`
    // should not navigate.
    act(() => {
      pushFromCurrent('/new');
    });

    // Location should still be /elsewhere because the function was "bound" to /current
    await waitFor(() => {
      expect(currentPathname).toBe('/elsewhere');
    });
  });
});

describe('useScrollToHash', () => {
  it('scrolls to element when hash is present in URL', async () => {
    // Create target element with mocked scrollIntoView
    const targetElement = document.createElement('div');
    targetElement.id = 'section';
    targetElement.scrollIntoView = jest.fn();
    document.body.appendChild(targetElement);

    const wrapper: React.FC = ({ children }) => (
      <MemoryRouter initialEntries={['/page#section']}>{children}</MemoryRouter>
    );

    renderHook(() => useScrollToHash(), { wrapper });

    // Wait for the setTimeout to complete (100ms delay in the hook)
    await waitFor(
      () => {
        expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        });
      },
      { timeout: 200 },
    );

    document.body.removeChild(targetElement);
  });

  it('does not scroll when no hash is present', async () => {
    // Create element just to verify scrollIntoView is NOT called
    const targetElement = document.createElement('div');
    targetElement.id = 'section';
    targetElement.scrollIntoView = jest.fn();
    document.body.appendChild(targetElement);

    const wrapper: React.FC = ({ children }) => (
      <MemoryRouter initialEntries={['/page']}>{children}</MemoryRouter>
    );

    renderHook(() => useScrollToHash(), { wrapper });

    // Wait a bit and verify it was NOT called
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(targetElement.scrollIntoView).not.toHaveBeenCalled();

    document.body.removeChild(targetElement);
  });

  it('does not throw if element does not exist', async () => {
    const wrapper: React.FC = ({ children }) => (
      <MemoryRouter initialEntries={['/page#nonexistent']}>
        {children}
      </MemoryRouter>
    );

    // This should not throw even if element doesn't exist
    renderHook(() => useScrollToHash(), { wrapper });

    // Wait for the timeout to complete
    await new Promise((resolve) => setTimeout(resolve, 150));
  });
});
