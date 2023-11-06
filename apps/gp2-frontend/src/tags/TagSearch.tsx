import { TagSearchPageList } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { FC } from 'react';
import Frame from '../Frame';
import { useAlgolia } from '../hooks/algolia';
import { useSearch } from '../hooks/search';
import { getItemTypes } from './api';
import ResultList from './ResultList';

const TagSearch: FC = () => {
  const { searchQuery, setSearchQuery, filters, toggleFilter } = useSearch([
    'entityType',
  ]);

  const filterSet = new Set<gp2.EntityType>(filters.entityType);
  const onChangeFilter = (filter: string) => {
    toggleFilter(filter, 'entityType');
  };

  const { client } = useAlgolia();
  const { tags, setTags } = useSearch();

  return (
    <TagSearchPageList
      searchQuery={searchQuery}
      onChangeSearch={setSearchQuery}
      filters={filterSet}
      onChangeFilter={onChangeFilter}
      tags={tags}
      setTags={setTags}
      loadTags={async (tagQuery) => {
        const searchedTags = await client.searchForTagValues(
          getItemTypes(filters.entityType ? filters.entityType : []),
          tagQuery,
          { tagFilters: tags },
        );
        return searchedTags.facetHits.map(({ value }) => ({
          label: value,
          value,
        }));
      }}
    >
      <Frame title="Tag Search Results List">
        <ResultList filters={filterSet} />
      </Frame>
    </TagSearchPageList>
  );
};

export default TagSearch;
