declare module 'react-router-dom' {
  import * as React from 'react';

  // Location and History interfaces
  export interface Location {
    pathname: string;
    search: string;
    state?: unknown;
    hash: string;
  }

  export interface History {
    push(path: string | object): void;
    replace(path: string | object): void;
    go(n: number): void;
    goBack(): void;
    goForward(): void;
    block(
      message?:
        | string
        | ((location: Location, action: string) => string | false | undefined),
    ): () => void;
    location: Location;
  }

  export interface Match<
    Params extends { [K in keyof Params]?: string } = Record<string, never>,
  > {
    params: Params;
    isExact: boolean;
    path: string;
    url: string;
  }

  // Hook return types
  export function useHistory(): History;
  export function useLocation(): Location;
  export function useParams<
    T extends { [K in keyof T]?: string } = Record<string, never>,
  >(): T;
  export function useRouteMatch<
    T extends { [K in keyof T]?: string } = Record<string, never>,
  >(
    path?:
      | string
      | {
          path?: string;
          exact?: boolean;
          strict?: boolean;
          sensitive?: boolean;
        },
  ): Match<T> | null;

  // Router Components
  export interface RouteProps {
    path?: string | string[];
    exact?: boolean;
    children?: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component?: React.ComponentType<any>;
    render?: (props: unknown) => React.ReactNode;
  }

  export interface SwitchProps {
    children?: React.ReactNode;
  }

  export interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string | object;
    replace?: boolean;
    children?: React.ReactNode;
  }

  export interface NavLinkProps extends LinkProps {
    activeClassName?: string;
    activeStyle?: React.CSSProperties;
    exact?: boolean;
    strict?: boolean;
    isActive?: (
      match: Match<Record<string, never>>,
      location: Location,
    ) => boolean;
  }

  export interface RedirectProps {
    to: string | object;
    push?: boolean;
    from?: string;
    exact?: boolean;
    strict?: boolean;
  }

  export interface RouterProps {
    children?: React.ReactNode;
    history: History;
  }

  export interface MemoryRouterProps {
    children?: React.ReactNode;
    initialEntries?: (string | object)[];
    initialIndex?: number;
  }

  export interface StaticRouterProps {
    children?: React.ReactNode;
    location?: string | object;
    context?: unknown;
  }

  // Components
  export const Route: React.ComponentType<RouteProps>;
  export const Switch: React.ComponentType<SwitchProps>;
  export const Link: React.ComponentType<LinkProps>;
  export const NavLink: React.ComponentType<NavLinkProps>;
  export const NavHashLink: React.ComponentType<NavLinkProps>;
  export const Redirect: React.ComponentType<RedirectProps>;
  export const Router: React.ComponentType<RouterProps>;
  export const MemoryRouter: React.ComponentType<MemoryRouterProps>;
  export const StaticRouter: React.ComponentType<StaticRouterProps>;
}
