import { useCurrentUser } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import { ReactNode } from 'react';
import { Redirect, Route, Switch, BrowserRouter } from 'react-router-dom';

import RouterPrompt from '../structure/RouterPrompt';

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
    <BrowserRouter
      getUserConfirmation={() => {
        /* Empty callback to block the default browser prompt */
      }}
    >
      <Switch>
        <Route path={ownProfilePath}>
          <RouterPrompt
            when={!user.onboarded}
            pattern="(teams|groups)\b"
            message="This link will be available when your profile is complete"
          >
            {children}
          </RouterPrompt>
        </Route>

        <Route to="/">
          <Redirect to={ownProfilePath} />;
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default CheckOnboarded;
