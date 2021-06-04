import { useCurrentUser } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { ReactNode } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

interface CheckOnboardedProps {
  children: ReactNode;
}
const CheckOnboarded: React.FC<CheckOnboardedProps> = ({ children }) => {
  const user = useCurrentUser();

  if (!user) {
    throw new Error(
      'No current user is authenticated. CheckOnboarded expects that a general auth check has already been done and the current user is known.',
    );
  }

  if (user.onboarded) {
    return <>{children}</>;
  }

  const ownProfilePath = network({}).users({}).user({ userId: user.id }).$;
  return (
    <Switch>
      <Route path={ownProfilePath}>{children}</Route>
      <Redirect to={ownProfilePath} />;
    </Switch>
  );
};

export default CheckOnboarded;
