import { createMemoryRouter, RouterProvider, Outlet } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import ErrorBoundary from '../ErrorBoundary';

mockConsoleError();

const Throw: React.FC<Record<string, never>> = () => {
  throw new Error('oops');
};

describe('error boundary', () => {
  it('catches child errors', () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: (
          <ErrorBoundary disableSentryReporting={true}>
            <Outlet />
          </ErrorBoundary>
        ),
        children: [{ path: '/', element: <Throw /> }],
      },
    ]);

    const { container } = render(<RouterProvider router={router} />);
    expect(container).toHaveTextContent('oops');
  });

  it('Overrides title and description when error thrown', () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: (
          <ErrorBoundary
            disableSentryReporting={true}
            title="Something went wrong"
            description="There was a problem with your request"
          >
            <Outlet />
          </ErrorBoundary>
        ),
        children: [{ path: '/', element: <Throw /> }],
      },
    ]);

    const { container } = render(<RouterProvider router={router} />);
    expect(container).not.toHaveTextContent('oops');
    expect(container).toHaveTextContent('Something went wrong');
    expect(container).toHaveTextContent(
      'There was a problem with your request',
    );
  });

  it('resets on navigation', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ErrorBoundary disableSentryReporting={true}>
              <Outlet />
            </ErrorBoundary>
          ),
          children: [
            { path: 'home', element: <>at home</> },
            { path: 'throw', element: <Throw /> },
          ],
        },
      ],
      { initialEntries: ['/throw'] },
    );

    const { container } = render(<RouterProvider router={router} />);
    expect(container).toHaveTextContent('oops');

    await router.navigate('/home');

    await waitFor(() => {
      expect(container).not.toHaveTextContent('oops');
      expect(container).toHaveTextContent('at home');
    });
  });
});
describe('sentry error boundary', () => {
  it('catches child errors', () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: (
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        ),
        children: [{ path: '/', element: <Throw /> }],
      },
    ]);

    const { container } = render(<RouterProvider router={router} />);
    expect(container).toHaveTextContent('oops');
  });

  it('Overrides title and description when error thrown', () => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: (
          <ErrorBoundary
            title="Something went wrong"
            description="There was a problem with your request"
          >
            <Outlet />
          </ErrorBoundary>
        ),
        children: [{ path: '/', element: <Throw /> }],
      },
    ]);

    const { container } = render(<RouterProvider router={router} />);
    expect(container).toHaveTextContent('Something went wrong');
    expect(container).toHaveTextContent(
      'There was a problem with your request',
    );
  });
});
