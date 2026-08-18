import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderResult } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { Api } from './api/client';
import { TestApiProvider } from './api/ApiProvider';
import type { Me } from './api/types';
import { AuthContext, AuthState } from './auth/AuthProvider';
import { MeContext } from './auth/MeContext';

export const authenticatedState: AuthState = {
  isLoading: false,
  isAuthenticated: true,
  user: { email: 'jane@example.com', name: 'Jane Doe' },
  getToken: () => Promise.resolve('token'),
  login: () => Promise.resolve(),
  logout: () => {},
};

export const anonymousState: AuthState = {
  ...authenticatedState,
  isAuthenticated: false,
  user: undefined,
};

export const memberMe: Me = {
  sub: 'auth0|1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'member',
};

export const adminMe: Me = {
  sub: 'auth0|admin',
  name: 'Dana Admin',
  email: 'dana@example.com',
  role: 'admin',
};

export const renderApp = (
  children: ReactNode,
  {
    api = {},
    auth = authenticatedState,
    me,
    route = '/',
    routePath = route,
  }: {
    api?: Partial<Api>;
    auth?: AuthState;
    me?: Me;
    route?: string;
    routePath?: string;
  } = {},
): RenderResult => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const content = me ? (
    <MeContext.Provider value={me}>{children}</MeContext.Provider>
  ) : (
    children
  );

  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={auth}>
        <QueryClientProvider client={queryClient}>
          <TestApiProvider api={api}>
            <Routes>
              <Route path={routePath} element={content} />
            </Routes>
          </TestApiProvider>
        </QueryClientProvider>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
};
