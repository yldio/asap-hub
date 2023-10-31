import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { FC, lazy, useEffect } from 'react';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import {
  useCurrentUserGP2,
  useCurrentUserRoleGP2,
} from '@asap-hub/react-context';
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

  const output = useOutputById(outputId);

  const userRole = useCurrentUserRoleGP2(
    output?.mainEntity.id,
    output?.mainEntity.type,
  );
  const isAdministrator =
    currentUser?.role === 'Administrator' || userRole === 'Project manager';

  const isAssociationMember = userRole !== undefined;

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
          <OutputDetailPage
            isAdministrator={isAdministrator}
            isAssociationMember={isAssociationMember}
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
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default OutputDetail;
