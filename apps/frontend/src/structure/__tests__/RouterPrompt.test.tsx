import { render } from '@testing-library/react';
import { Router, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import { createBrowserHistory, History } from 'history';

import RouterPrompt from '../RouterPrompt';

describe('custom router prompt', () => {
  let history: History;
  beforeEach(() => {
    history = createBrowserHistory();
  });

  const wrapper: React.FC = ({ children }) => (
    <Router history={history}>
      <LastLocationProvider>{children}</LastLocationProvider>
    </Router>
  );

  it('opens an alert when the route matches the pattern', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Route path="/">
        <RouterPrompt
          when={true}
          pattern="(team|group)\b"
          message="Not available"
        >
          <span>content</span>
        </RouterPrompt>
      </Route>,
      { wrapper },
    );

    history.push('/team');
    history.push('/teams');
    history.push('/group');
    history.push('/groups');
    history.push('/');

    expect(window.alert).toHaveBeenCalledWith('Not available');
    expect(window.alert).toHaveBeenCalledTimes(2);
  });
});
