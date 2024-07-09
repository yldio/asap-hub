import { parse } from 'qs';
import { useParams, useSearchParams } from 'react-router-dom';
import { RouteNode } from 'typesafe-routes';
import * as gp2 from './gp2';

export * from './about';
export * from './analytics';
export * from './discover';
export { default as logout } from './logout';
export * from './network';
export type { OutputDocumentTypeParameter } from './network';
export * from './news';
export * from './shared-research';
export * from './events';
export { default as staticPages } from './static-pages';
export { default as welcome } from './welcome';
export * from './tags';
export * from './dashboard';

export type { RouteNode };
export { gp2 };

// copied and fixed from typesafe-routes/react-router
/* eslint-disable @typescript-eslint/no-explicit-any */
export const useRouteParams = <R extends RouteNode<string, any, any>>(
  route: R,
): ReturnType<R['parseParams']> => {
  const [search] = useSearchParams();
  return route.parseParams({
    ...useParams(),
    ...parse(search, { ignoreQueryPrefix: true }),
  }) as any;
};

// We could refactor this to use typesafe-routes even for the query params
export const searchQueryParam = 'searchQuery';
export const viewParam = 'view';
export const listViewValue = 'list';
