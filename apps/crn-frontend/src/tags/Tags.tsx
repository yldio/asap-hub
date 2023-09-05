import { TagsPage, TagsPageBody } from '@asap-hub/react-components';
import { usePagination, usePaginationParams, useSearch } from '../hooks';

const Tags: React.FC<Record<string, never>> = () => {
  const { tags, setTags } = useSearch();
  const { currentPage, pageSize } = usePaginationParams();
  const { numberOfPages, renderPageHref } = usePagination(0, pageSize);
  return (
    <TagsPage
      tags={tags}
      setTags={setTags}
      loadTags={() =>
        new Promise((resolve) =>
          resolve([
            { value: 'test', label: 'test' },
            { value: 'test2', label: 'test2' },
            { value: 'test3', label: 'test3' },
          ]),
        )
      }
    >
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
