import { CRNTagSearchEntitiesList } from '@asap-hub/algolia';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { NotFoundPage, TagsPage } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/frontend-utils';

import Tags from './TagsList';
import { useAlgolia } from '../hooks/algolia';
import { useSearch } from '../hooks';

export const entities: CRNTagSearchEntitiesList = [
  'research-output',
  'user',
  'event',
  'team',
  'working-group',
  'tutorial',
];

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
              entities,
              tagQuery,
              { facetFilters: tags.map((tag) => `_tags:${tag}`) },
            );
            return searchedTags.facetHits.map(({ value }) => ({
              label: value,
              value,
            }));
          }}
        >
          <Frame title="Search">
            <Tags entities={entities} />
          </Frame>
        </TagsPage>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
