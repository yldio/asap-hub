import { OutputDetailPage, OutputFormPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import {
  useCurrentUserGP2,
  useCurrentUserRoleGP2,
  useFlags,
} from '@asap-hub/react-context';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Frame from '../Frame';
import { useOutputById } from './state';

const loadShareOutput = () =>
  import(/* webpackChunkName: "share-output" */ './ShareOutput');

const ShareOutput = lazy(loadShareOutput);

const OutputDetail: FC = () => {
  const { outputId } = useRouteParams(gp2Routing.outputs({}).output);
  const { path } = useRouteMatch();
  const currentUser = useCurrentUserGP2();
  const { isEnabled } = useFlags();

  const output = useOutputById(outputId);

  const userRole = useCurrentUserRoleGP2(
    output?.mainEntity.id,
    output?.mainEntity.type,
  );
  const isAdministrator =
    currentUser?.role === 'Administrator' || userRole === 'Project manager';

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadShareOutput();
  }, []);

  if (!output) {
    return <NotFoundPage />;
  }
  return (
    <Switch>
      <Route exact path={path}>
        <Frame title="Output">
          <OutputDetailPage
            canVersion={isEnabled('VERSION_RESEARCH_OUTPUT')}
            isAdministrator={isAdministrator}
            {...output}
          />
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
      <Route
        exact
        path={
          path + gp2Routing.outputs({}).output({ outputId }).version.template
        }
      >
        <Frame title="Version Output">
          <OutputFormPage
            message="The previous output page will be replaced with a summarised version
            history section."
          >
            <ShareOutput output={output} createVersion />
          </OutputFormPage>
        </Frame>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default OutputDetail;
