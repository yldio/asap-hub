import { TagsPage, TagsPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams, useSearch } from '../hooks';

const Tags: React.FC<Record<string, never>> = () => {
  const { tags, setTags } = useSearch();
  const { currentPage, pageSize } = usePaginationParams();
  const { numberOfPages, renderPageHref } = usePagination(0, pageSize);
  return (
    <TagsPage tags={tags} setTags={setTags}>
      <TagsPageBody
        currentPage={currentPage}
        numberOfItems={0}
        numberOfPages={numberOfPages}
        renderPageHref={renderPageHref}
        results={[]}
      />
    </TagsPage>
  );
};

export default Tags;
