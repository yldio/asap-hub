import { TagSearchPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { FC, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Frame from '../Frame';

const loadTagSearch = () =>
  import(/* webpackChunkName: "tag-search" */ './TagSearch');

const TagSearch = lazy(loadTagSearch);

const Tags: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadTagSearch();
  }, []);
  // const { path } = useMatch();
  const { pathname: path } = useLocation();

  return (
    <Routes>
      <Route
        path=""
        element={
          <Frame title="Tags Search">
            <TagSearchPage>
              <Frame title="Tags Search">
                <TagSearch />
              </Frame>
            </TagSearchPage>
          </Frame>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Tags;
