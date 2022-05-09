import { ContentPage, NotFoundPage } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/frontend-utils';

import { usePageByPath } from './state';

interface ContentProps {
  pageId: string;
}
const Content: React.FC<ContentProps> = ({ pageId }) => {
  const page = usePageByPath(pageId);

  if (page) {
    return (
      <Frame title={page.title}>
        <ContentPage {...page} />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Content;
