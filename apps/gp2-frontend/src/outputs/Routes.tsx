import { OutputsPage } from '@asap-hub/gp2-components';
import { Loading, NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { FC, Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import Frame from '../Frame';
import OutputDetail from './OutputDetail';

const loadOutputDirectory = () =>
  import(/* webpackChunkName: "output-directory" */ './OutputDirectory');

const OutputDirectory = lazy(loadOutputDirectory);

const Outputs: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadOutputDirectory();
  }, []);

  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  params.delete('searchQuery');
  const frameKey = params.toString();

  return (
    <Suspense key={pathname} fallback={<Loading />}>
      <Routes>
        <Route
          index
          element={
            <Frame title="Outputs">
              <OutputsPage>
                <Frame key={frameKey} title="Outputs">
                  <OutputDirectory />
                </Frame>
              </OutputsPage>
            </Frame>
          }
        />
        <Route
          path={`${gp2.outputs({}).output.template}/*`}
          element={<OutputDetail />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default Outputs;
