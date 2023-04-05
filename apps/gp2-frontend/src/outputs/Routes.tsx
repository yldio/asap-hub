import { FC } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { OutputsPage } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/routing';

import OutputList from './OutputList';
import ShareOutput from './ShareOutput';
import Frame from '../Frame';

const Outputs: FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Frame title="Outputs">
          <OutputsPage>
            <Frame title={null}>
              <OutputList />
            </Frame>
          </OutputsPage>
        </Frame>
      </Route>
      <Route path={path + gp2.outputs({}).output.template}>
        <Frame title="Output">
          <ShareOutput />
        </Frame>
      </Route>
    </Switch>
  );
};

export default Outputs;
