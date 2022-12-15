import { render } from '@testing-library/react';
import { createBrowserHistory, History } from 'history';
import { Router, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';

import { useBackHref } from '../routing';

describe('useBackHref', () => {
  let history: History;
  beforeEach(() => {
    history = createBrowserHistory();
  });

  const wrapper: React.FC = ({ children }) => (
    <Router history={history}>
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

  it('returns the last location at the time the component was mounted', () => {
    const { container } = render(
      <Route path="/comp">
        <ShowBackHref />
      </Route>,
      { wrapper },
    );
    history.push('/last?q#f');
    history.push('/comp');
    history.push('/comp/child');
    expect(container).toHaveTextContent('/last?q#f');
  });
});
