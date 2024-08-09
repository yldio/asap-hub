import { Frame } from '@asap-hub/frontend-utils';
import { NotFoundPage, TutorialDetailsPage } from '@asap-hub/react-components';
import { discoverRoutes } from '@asap-hub/routing';
import { useTypedParams } from 'react-router-typesafe-routes/dom';

import { useTutorialById } from './state';

const Tutorial: React.FC<Record<string, never>> = () => {
  const { id } = useTypedParams(discoverRoutes.DEFAULT.$.TUTORIALS.$.DETAILS);

  const tutorial = useTutorialById(id);

  if (tutorial) {
    const props = {
      ...tutorial,
      text: tutorial.text || '',
    };
    return (
      <Frame title={tutorial.title}>
        <TutorialDetailsPage {...props} />
      </Frame>
    );
  }

  return <NotFoundPage />;
};

export default Tutorial;
