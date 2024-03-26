import { OutputsPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { FC, lazy, useEffect } from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';
import Frame from '../Frame';
import OutputDetail from './OutputDetail';

const loadOutputDirectory = () =>
  import(/* webpackChunkName: "output-directory" */ './OutputDirectory');

const OutputDirectory = lazy(loadOutputDirectory);

const Outputs: FC<Record<string, never>> = () => {
  const { path } = useMatch();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadOutputDirectory();
  }, []);

  return (
    <Routes>
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
        <OutputDetail />
      </Route>
      <Route component={NotFoundPage} />
    </Routes>
  );
};

export default Outputs;
