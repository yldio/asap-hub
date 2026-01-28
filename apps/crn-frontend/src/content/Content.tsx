import { RecoilRoot } from 'recoil';
import { ContentPage, NotFoundPage, Loading } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/frontend-utils';

import { usePageByPageId } from './state';

interface ContentProps {
  pageId: string;
}
const Content: React.FC<ContentProps> = ({ pageId }) => {
  const pageLoadable = usePageByPageId(pageId);

  if (pageLoadable.state === 'loading') {
    return <Loading />;
  }

  if (pageLoadable.state === 'hasValue' && pageLoadable.contents) {
    return (
      <Frame title={pageLoadable.contents.title}>
        <ContentPage {...pageLoadable.contents} />
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
