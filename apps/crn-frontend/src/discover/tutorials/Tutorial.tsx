import { NotFoundPage, NewsDetailsPage } from '@asap-hub/react-components';
import { tutorials as tutorialsRoute, useRouteParams } from '@asap-hub/routing';
import { Frame } from '@asap-hub/frontend-utils';

import { useTutorialById } from './state';

const Tutorial: React.FC<Record<string, never>> = () => {
  const { tutorialId } = useRouteParams(tutorialsRoute({}).tutorial);

  const tutorial = useTutorialById(tutorialId);

  if (tutorial) {
    const props = {
      ...tutorial,
      text: tutorial.text || '',
    };
    return (
      <Frame title={tutorial.title}>
        <NewsDetailsPage {...props} type="Tutorial" />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Tutorial;
