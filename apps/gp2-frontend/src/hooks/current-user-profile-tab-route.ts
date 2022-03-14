import { network } from '@asap-hub/routing';
import { useLocation } from 'react-router-dom';
import { relative } from 'path';
import { useCurrentUser } from '@asap-hub/react-context';

export const useCurrentUserProfileTabRoute = () => {
  const user = useCurrentUser();
  const { pathname } = useLocation();
  if (!user) {
    return undefined;
  }
  const route = network({}).users({}).user;
  const tabRoutes = route({ userId: user.id });
  return [tabRoutes.about, tabRoutes.research, tabRoutes.outputs].find(
    (possibleTabRoute) =>
      !relative(possibleTabRoute({}).$, pathname).startsWith('..'),
  );
};
