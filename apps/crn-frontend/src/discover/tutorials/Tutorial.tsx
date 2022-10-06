import { NotFoundPage, NewsDetailsPage } from '@asap-hub/react-components';
import { tutorials as tutorialsRoute, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { useTutorialById } from './state';

const Tutorial: React.FC<Record<string, never>> = () => {
  const { articleId } = useRouteParams(tutorialsRoute({}).article);

  const tutorial = useTutorialById(articleId);

  if (tutorial) {
    const props = {
      ...tutorial,
      text: tutorial.text || '',
    };
    return (
      <Frame title={tutorial.title}>
        <NewsDetailsPage {...props} />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Tutorial;
