import { NewsPageBody, Loading } from '@asap-hub/react-components';

import { useNews } from '../api';

const NewsList: React.FC<Record<string, never>> = () => {
  const result = useNews();

  if (result.loading) {
    return <Loading />;
  }

  return <NewsPageBody news={result.data.items} />;
};

export default NewsList;
