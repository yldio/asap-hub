import { useLocation, useParams } from 'react-router-dom';
import { RouteNode } from 'typesafe-routes';
import { parse } from 'qs';

export { default as events } from './events';
export { default as discover } from './discover';
export { default as logout } from './logout';
export { default as network } from './network';
export { default as news } from './news';
export { default as sharedResearch } from './shared-research';
export { default as welcome } from './welcome';

// copied and fixed from typesafe-routes/react-router
/* eslint-disable @typescript-eslint/no-explicit-any */
export const useRouteParams = <R extends RouteNode<string, any, any>>(
  route: R,
): ReturnType<R['parseParams']> => {
  const { search } = useLocation();
  return route.parseParams({
    ...useParams(),
    ...parse(search, { ignoreQueryPrefix: true }),
  }) as any;
};

export type { RouteNode };

// We could refactor this to use typesafe-routes even for the query params
export const searchQueryParam = 'searchQuery';
export const viewParam = 'view';
export const listViewValue = 'list';
