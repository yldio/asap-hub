import { BasicLayout, OnboardWelcome } from '@asap-hub/gp2-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

const Routes: React.FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  return (
    <BasicLayout>
      <Switch>
        <Route exact path={path}>
          <OnboardWelcome />
        </Route>
      </Switch>
    </BasicLayout>
  );
};
export default Routes;
