import { CRNTagSearchEntitiesList } from '@asap-hub/algolia';
import { TagsPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams, useSearch } from '../hooks';
import { useTagSearch } from './state';

type TagsProps = {
  entities: CRNTagSearchEntitiesList;
};
const Tags: React.FC<TagsProps> = ({ entities }) => {
  const { tags, searchQuery } = useSearch();
  const { currentPage, pageSize } = usePaginationParams();
  const { items, total } = useTagSearch(entities, {
    searchQuery,
    currentPage,
    pageSize,
    tags,
  });

  const { numberOfPages, renderPageHref } = usePagination(total, pageSize);
  return (
    <TagsPageBody
      currentPage={currentPage}
      numberOfItems={total}
      numberOfPages={numberOfPages}
      renderPageHref={renderPageHref}
      results={items}
    />
  );
};

export default Tags;
