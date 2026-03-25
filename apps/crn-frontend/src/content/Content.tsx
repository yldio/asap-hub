import { ContentPage, NotFoundPage, Loading } from '@asap-hub/react-components';
import { Frame } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClientDefaultOptions } from '@asap-hub/frontend-utils';

import { usePageByPageId } from './state';

interface ContentProps {
  pageId: string;
}
export const Content: React.FC<ContentProps> = ({ pageId }) => {
  const { data: page, isLoading } = usePageByPageId(pageId);

  if (isLoading) {
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

const queryClient = new QueryClient({
  defaultOptions: queryClientDefaultOptions,
});

const ContentWithQueryClient: React.FC<ContentProps> = (props) => (
  <QueryClientProvider client={queryClient}>
    <Content {...props} />
  </QueryClientProvider>
);

export default ContentWithQueryClient;
