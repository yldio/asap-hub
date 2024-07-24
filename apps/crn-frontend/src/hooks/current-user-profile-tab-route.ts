import { useCurrentUserCRN } from '@asap-hub/react-context';
import { networkRoutes } from '@asap-hub/routing';
import { relative } from 'path';
import { useResolvedPath } from 'react-router-dom';

export const useCurrentUserProfileTabRoute = () => {
  const user = useCurrentUserCRN();
  const { pathname } = useResolvedPath('');

  if (!user) {
    return undefined;
  }
  const route = networkRoutes.DEFAULT.USERS.DETAILS;
  const routeParams = { id: user.id };
  return [route.ABOUT, route.RESEARCH, route.OUTPUTS].find(
    (possibleTabRoute) =>
      !relative(possibleTabRoute.buildPath(routeParams), pathname).startsWith(
        '..',
      ),
  );
};
