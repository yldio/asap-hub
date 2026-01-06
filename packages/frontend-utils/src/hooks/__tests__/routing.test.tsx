import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { useBackHref } from '../routing';

describe('useBackHref', () => {
  const ShowBackHref: React.FC = () => {
    const backHref = useBackHref();
    return <>{backHref ?? 'null'}</>;
  };

  it('returns null if there is no last location', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ShowBackHref />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(container.textContent).toBe('null');
  });

  it('returns the last location from state if available', () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/last', search: '?q', hash: '#f' },
          {
            pathname: '/comp',
            state: { from: { pathname: '/last', search: '?q', hash: '#f' } },
          },
        ]}
      >
        <Routes>
          <Route path="/comp" element={<ShowBackHref />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(container.textContent).toBe('/last?q#f');
  });

  it('returns null if state.from is not available', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/comp']}>
        <Routes>
          <Route path="/comp" element={<ShowBackHref />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(container.textContent).toBe('null');
  });

  describe('document.referrer fallback', () => {
    const originalReferrer = Object.getOwnPropertyDescriptor(
      document,
      'referrer',
    );
    const originalLocation = window.location;
    let mockLocation: Location;

    beforeEach(() => {
      // Create a mock location object with configurable origin
      mockLocation = {
        ...originalLocation,
        origin: 'https://example.com',
      } as Location;

      // Replace window.location with our mock
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      if (originalReferrer) {
        Object.defineProperty(document, 'referrer', originalReferrer);
      }
      // Restore original location
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
        configurable: true,
      });
    });

    it('returns referrer pathname, search, and hash when referrer is from same origin', () => {
      // Mock document.referrer
      Object.defineProperty(document, 'referrer', {
        value: 'https://example.com/previous?query=test#section',
        writable: true,
        configurable: true,
      });

      const { container } = render(
        <MemoryRouter initialEntries={['/current']}>
          <Routes>
            <Route path="/current" element={<ShowBackHref />} />
          </Routes>
        </MemoryRouter>,
      );
      expect(container.textContent).toBe('/previous?query=test#section');
    });

    it('returns referrer pathname only when search and hash are empty', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://example.com/previous',
        writable: true,
        configurable: true,
      });

      const { container } = render(
        <MemoryRouter initialEntries={['/current']}>
          <Routes>
            <Route path="/current" element={<ShowBackHref />} />
          </Routes>
        </MemoryRouter>,
      );
      expect(container.textContent).toBe('/previous');
    });

    it('returns null when referrer is from different origin', () => {
      // Update the mock location's origin for this test
      Object.defineProperty(window, 'location', {
        value: {
          ...mockLocation,
          origin: 'https://example.com',
        },
        writable: true,
        configurable: true,
      });
      Object.defineProperty(document, 'referrer', {
        value: 'https://different-origin.com/page',
        writable: true,
        configurable: true,
      });

      const { container } = render(
        <MemoryRouter initialEntries={['/current']}>
          <Routes>
            <Route path="/current" element={<ShowBackHref />} />
          </Routes>
        </MemoryRouter>,
      );
      expect(container.textContent).toBe('null');
    });

    it('returns null when referrer is empty', () => {
      Object.defineProperty(document, 'referrer', {
        value: '',
        writable: true,
        configurable: true,
      });

      const { container } = render(
        <MemoryRouter initialEntries={['/current']}>
          <Routes>
            <Route path="/current" element={<ShowBackHref />} />
          </Routes>
        </MemoryRouter>,
      );
      expect(container.textContent).toBe('null');
    });

    it('prefers state.from over document.referrer when both are available', () => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://example.com/referrer-page',
        writable: true,
        configurable: true,
      });

      const { container } = render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/current',
              state: {
                from: {
                  pathname: '/state-page',
                  search: '?state',
                  hash: '#hash',
                },
              },
            },
          ]}
        >
          <Routes>
            <Route path="/current" element={<ShowBackHref />} />
          </Routes>
        </MemoryRouter>,
      );
      // Should use state.from, not document.referrer
      expect(container.textContent).toBe('/state-page?state#hash');
    });
  });
});
