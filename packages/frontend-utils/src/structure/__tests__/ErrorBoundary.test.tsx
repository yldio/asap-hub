import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { act, render } from '@testing-library/react';
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
    const routes = [
      {
        path: '/home',
        element: 'at home',
      },
      {
        path: '/throw',
        element: <Throw />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/throw'],
    });

    const { container } = render(
      <ErrorBoundary disableSentryReporting={true}>
        <RouterProvider router={router} />
      </ErrorBoundary>,
    );
    expect(container).toHaveTextContent('oops');

    act(() => {
      router.navigate('/home');
    });

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
