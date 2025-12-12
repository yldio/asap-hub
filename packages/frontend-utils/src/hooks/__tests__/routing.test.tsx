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
});
