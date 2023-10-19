import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { FC, lazy, useEffect } from 'react';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { OutputDetailPage, OutputFormPage } from '@asap-hub/gp2-components';
import Frame from '../Frame';
import { useOutputById } from './state';

const loadShareOutput = () =>
  import(/* webpackChunkName: "share-output" */ './ShareOutput');

const ShareOutput = lazy(loadShareOutput);

const OutputDetail: FC = () => {
  const { outputId } = useRouteParams(gp2Routing.outputs({}).output);
  const { path } = useRouteMatch();
  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';

  const output = useOutputById(outputId);

  useEffect(() => {
    loadShareOutput();
  }, []);

  if (!output) {
    return <NotFoundPage />;
  }

  return (
    <Switch>
      <Route exact path={path}>
        <Frame title="Output">
          <OutputDetailPage isAdministrator={isAdministrator} {...output} />
        </Frame>
      </Route>
      <Route
        exact
        path={path + gp2Routing.outputs({}).output({ outputId }).edit.template}
      >
        <Frame title="Edit Output">
          <OutputFormPage>
            <ShareOutput output={output} />
          </OutputFormPage>
        </Frame>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default OutputDetail;
