import { OutputDetailPage, OutputFormPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import {
  useCurrentUserGP2,
  useCurrentUserRoleGP2,
  useFlags,
} from '@asap-hub/react-context';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { useTypedParams } from 'react-router-typesafe-routes/dom';
import { FC, lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Frame from '../Frame';
import { useOutputById } from './state';

const loadShareOutput = () =>
  import(/* webpackChunkName: "share-output" */ './ShareOutput');

const ShareOutput = lazy(loadShareOutput);

const OutputDetail: FC = () => {
  const { outputId } = useTypedParams(gp2Routing.outputs.DEFAULT.DETAILS);
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
    <Routes>
      <Route
        path={''}
        element={
          <Frame title="Output">
            <OutputDetailPage
              canVersion={isEnabled('VERSION_RESEARCH_OUTPUT')}
              isAdministrator={isAdministrator}
              {...output}
            />
          </Frame>
        }
      />
      <Route
        path={gp2Routing.outputs.DEFAULT.DETAILS.$.EDIT.relativePath}
        element={
          <Frame title="Edit Output">
            <OutputFormPage>
              <ShareOutput output={output} />
            </OutputFormPage>
          </Frame>
        }
      />
      <Route
        path={gp2Routing.outputs.DEFAULT.DETAILS.$.VERSION.relativePath}
        element={
          <Frame title="Version Output">
            <OutputFormPage
              message="The previous output page will be replaced with a summarised version
            history section."
            >
              <ShareOutput output={output} createVersion />
            </OutputFormPage>
          </Frame>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default OutputDetail;
