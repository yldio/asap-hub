import { TagsPage, TagsPageBody } from '@asap-hub/react-components';
import { useSearch } from '../hooks';

const Tags: React.FC<Record<string, never>> = () => {
  const { tags, setTags } = useSearch();
  return (
    <TagsPage tags={tags} setTags={setTags}>
      <TagsPageBody
        currentPage={0}
        numberOfItems={0}
        numberOfPages={0}
        renderPageHref={() => '#'}
        results={[]}
      />
    </TagsPage>
  );
};

export default Tags;
