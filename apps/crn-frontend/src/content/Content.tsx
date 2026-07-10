import { ContentPage, NotFoundPage, Loading } from '@asap-hub/react-components';
import { Frame, queryClientDefaultOptions } from '@asap-hub/frontend-utils';
import { useFlags } from '@asap-hub/react-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { usePageByPageId } from './state';
import ReactQueryDevtoolsProduction from '../ReactQueryDevtoolsProduction';

interface ContentProps {
  pageId: string;
}
const Content: React.FC<ContentProps> = ({ pageId }) => {
  // Same branching as the recoil Loadable: loading → Loading, value →
  // ContentPage, error or missing page → NotFoundPage.
  const { isPending, data: page } = usePageByPageId(pageId);

  if (isPending) {
    return <Loading />;
  }

  if (page) {
    return (
      <Frame title={page.title}>
        <ContentPage {...page} />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

const ContentWithProviders: React.FC<ContentProps> = (props) => {
  // The QueryClient lives and dies with this component: unmounting the content
  // page discards the cache (the same lifetime the old RecoilRoot had).
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: queryClientDefaultOptions }),
  );
  const { isEnabled } = useFlags();
  return (
    <QueryClientProvider client={queryClient}>
      <Content {...props} />
      {isEnabled('QUERY_DEVTOOLS') && <ReactQueryDevtoolsProduction />}
    </QueryClientProvider>
  );
};

export default ContentWithProviders;
