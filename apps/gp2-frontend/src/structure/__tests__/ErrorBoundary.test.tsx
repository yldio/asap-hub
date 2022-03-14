import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import ErrorBoundary from '../ErrorBoundary';

mockConsoleError();

const Throw: React.FC<Record<string, never>> = () => {
  throw new Error('oops');
};

describe('error boundary', () => {
  it('catches child errors', async () => {
    const { container } = render(
      <ErrorBoundary disableSentryReporting={true}>
        <Throw />
      </ErrorBoundary>,
    );
    expect(container).toHaveTextContent('oops');
  });

  it('Overrides title and description when error thrown', async () => {
    const { container } = render(
      <ErrorBoundary
        disableSentryReporting={true}
        title="Something went wrong"
        description="There was a problem with your request"
      >
        <Throw />
      </ErrorBoundary>,
    );
    expect(container).not.toHaveTextContent('oops');
    expect(container).toHaveTextContent('Something went wrong');
    expect(container).toHaveTextContent(
      'There was a problem with your request',
    );
  });

  it('resets on navigation', async () => {
    const history = createMemoryHistory({ initialEntries: ['/throw'] });
    const { container } = render(
      <Router history={history}>
        <ErrorBoundary disableSentryReporting={true}>
          <Route path="/home">at home</Route>
          <Route path="/throw">
            <Throw />
          </Route>
        </ErrorBoundary>
      </Router>,
    );
    expect(container).toHaveTextContent('oops');

    history.push('/home');
    expect(container).not.toHaveTextContent('oops');
    expect(container).toHaveTextContent('at home');
  });
});
describe('sentry error boundary', () => {
  it('catches child errors', async () => {
    const { container } = render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>,
    );
    expect(container).toHaveTextContent('oops');
  });

  it('Overrides title and description when error thrown', async () => {
    const { container } = render(
      <ErrorBoundary
        title="Something went wrong"
        description="There was a problem with your request"
      >
        <Throw />
      </ErrorBoundary>,
    );
    expect(container).toHaveTextContent('Something went wrong');
    expect(container).toHaveTextContent(
      'There was a problem with your request',
    );
  });
});
