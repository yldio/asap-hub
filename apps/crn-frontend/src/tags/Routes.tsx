import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NotFoundPage, TagsPage } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/frontend-utils';

import Tags from './TagsList';
import { useAlgolia } from '../hooks/algolia';
import { useSearch } from '../hooks';

const Routes: React.FC<Record<string, never>> = () => {
  const { path } = useRouteMatch();
  const { client } = useAlgolia();
  const { tags, setTags } = useSearch();

  return (
    <Switch>
      <Route exact path={path}>
        <TagsPage
          tags={tags}
          setTags={setTags}
          loadTags={async (tagQuery) => {
            const searchedTags = await client.searchForTagValues(
              ['research-output'],
              tagQuery,
              { tagFilters: tags },
            );
            return searchedTags.facetHits.map(({ value }) => ({
              label: value,
              value,
            }));
          }}
        >
          <Frame title="Search">
            <Tags />
          </Frame>
        </TagsPage>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
