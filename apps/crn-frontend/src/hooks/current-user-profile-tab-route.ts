import { useCurrentUserCRN } from '@asap-hub/react-context';
import { networkRoutes } from '@asap-hub/routing';
import { relative } from 'path';
import { useLocation } from 'react-router-dom';

export const useCurrentUserProfileTabRoute = () => {
  const user = useCurrentUserCRN();
  const { pathname } = useLocation();

  return undefined;
  // if (!user) {
  //   return undefined;
  // }
  // const route = networkRoutes.DEFAULT.USERS.DETAILS.buildPath;
  // const tabRoutes = route({ id: user.id });
  // return [tabRoutes.about, tabRoutes.research, tabRoutes.outputs].find(
  //   (possibleTabRoute) =>
  //     !relative(possibleTabRoute({}).$, pathname).startsWith('..'),
  // );
};
