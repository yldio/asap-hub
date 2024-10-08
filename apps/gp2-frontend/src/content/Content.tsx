import { RecoilRoot } from 'recoil';
import { ContentPage, NotFoundPage } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/frontend-utils';

import { usePageByPageId } from './state';

interface ContentProps {
  pageId: string;
}
const Content: React.FC<ContentProps> = ({ pageId }) => {
  const page = usePageByPageId(pageId);

  if (page) {
    return (
      <Frame title={page.title}>
        <ContentPage {...page} />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

const ContentWithRecoil: React.FC<ContentProps> = (props) => (
  <RecoilRoot>
    <Content {...props} />
  </RecoilRoot>
);

export default ContentWithRecoil;
