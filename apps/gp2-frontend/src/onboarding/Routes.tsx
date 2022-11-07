import { BasicLayout, OnboardWelcome } from '@asap-hub/gp2-components';
import { Route, Switch } from 'react-router-dom';

const Routes: React.FC<Record<string, never>> = () => (
  <BasicLayout>
    <Switch>
      <Route exact path={''}>
        <OnboardWelcome />
      </Route>
    </Switch>
  </BasicLayout>
);
export default Routes;
