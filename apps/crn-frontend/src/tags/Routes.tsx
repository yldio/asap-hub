import { useMemo } from 'react';
import {
  CRNTagSearchEntities,
  CRNTagSearchEntitiesListArray,
} from '@asap-hub/algolia';
import { Routes, Route } from 'react-router-dom';
import { NotFoundPage, TagsPage } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/frontend-utils';

import Tags from './TagsList';
import { useAlgolia } from '../hooks/algolia';
import { useSearch } from '../hooks';
import { useFlags } from '@asap-hub/react-context';

const options: { label: string; value: CRNTagSearchEntities }[] = [
  { label: 'Calendar & Events', value: 'event' },
  { label: 'Interest Groups', value: 'interest-group' },
  { label: 'News', value: 'news' },
  { label: 'People', value: 'user' },
  { label: 'Projects', value: 'project' },
  { label: 'Shared Research', value: 'research-output' },
  { label: 'Teams', value: 'team' },
  { label: 'Tutorials', value: 'tutorial' },
  { label: 'Working Groups', value: 'working-group' },
];

const RoutesComponent: React.FC<Record<string, never>> = () => {
  const { isEnabled } = useFlags();

  const filteredOptions = useMemo(
    () =>
      !isEnabled('PROJECTS_MVP')
        ? options.filter((option) => option.value !== 'project')
        : options,
    [isEnabled],
  );
  const { client } = useAlgolia();
  const { tags, setTags, filters, toggleFilter } = useSearch();

  const urlEntities = Array.from(filters).filter((value) =>
    CRNTagSearchEntitiesListArray.includes(value as CRNTagSearchEntities),
  ) as CRNTagSearchEntities[];

  const initialEntities = isEnabled('PROJECTS_MVP')
    ? CRNTagSearchEntitiesListArray
    : CRNTagSearchEntitiesListArray.filter(
        (entity: CRNTagSearchEntities) => entity !== 'project',
      );

  const entities = urlEntities.length > 0 ? urlEntities : initialEntities;

  return (
    <Routes>
      <Route
        index
        element={
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
            filters={new Set(urlEntities)}
            filterOptions={[{ title: 'AREAS' }, ...filteredOptions]}
            onChangeFilter={toggleFilter}
            isProjectsEnabled={isEnabled('PROJECTS_MVP')}
          >
            <Frame title="Search">
              <Tags entities={entities} />
            </Frame>
          </TagsPage>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RoutesComponent;
