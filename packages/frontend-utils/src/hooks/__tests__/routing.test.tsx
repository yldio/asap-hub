import { render } from '@testing-library/react';
import { createBrowserHistory, History } from 'history';
import { Route, Router, Routes } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-dom-last-location';

import { useBackHref } from '../routing';

describe('useBackHref', () => {
  let history: History;
  beforeEach(() => {
    history = createBrowserHistory({});
  });

  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Router location={history.location} navigator={history}>
      <LastLocationProvider>{children}</LastLocationProvider>
    </Router>
  );
  const ShowBackHref: React.FC = () => {
    const backHref = useBackHref();
    return <>{backHref ?? 'null'}</>;
  };

  it('returns null if there is no last location', () => {
    const { container } = render(<ShowBackHref />, { wrapper });
    expect(container).toHaveTextContent('null');
  });

  it('returns the last location at the time the component was mounted', async () => {
    const { container } = render(
      <Routes location={'/comp'}>
        <Route path="/comp" element={<ShowBackHref />} />
      </Routes>,
      { wrapper },
    );

    history.push('/last?q#f');
    history.push('/comp');
    history.push('/comp/child');

    expect(container).toHaveTextContent('/last?q#f');
  });
});
