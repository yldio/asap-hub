import { OutputsPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Frame from '../Frame';

const loadOutputDirectory = () =>
  import(/* webpackChunkName: "output-directory" */ './OutputDirectory');
const loadShareOutput = () =>
  import(/* webpackChunkName: "share-output" */ './ShareOutput');

const OutputDirectory = lazy(loadOutputDirectory);
const ShareOutput = lazy(loadShareOutput);

const Outputs: FC<Record<string, never>> = () => {
  useEffect(() => {
    loadOutputDirectory().then(loadShareOutput);
  }, []);
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Frame title="Outputs">
          <OutputsPage>
            <Frame title="Outputs">
              <OutputDirectory />
            </Frame>
          </OutputsPage>
        </Frame>
      </Route>
      <Route path={path + gp2.outputs({}).output.template}>
        <Frame title="Output">
          <ShareOutput />
        </Frame>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Outputs;
