import { Toast } from '@asap-hub/react-components';
import { useDismissable } from '../hooks';

const PROJECTS_BANNER_DISMISSED_KEY = 'crn-projects-banner-dismissed';

export const ProjectsBanner = () => {
  const [isDismissed, handleDismiss] = useDismissable(
    PROJECTS_BANNER_DISMISSED_KEY,
  );

  if (isDismissed) {
    return null;
  }

  return (
    <Toast accent="info" onClose={handleDismiss}>
      The Hub is growing! Visit the new Projects section to discover ongoing
      work across the network. Contact your Project Manager or Technical Support
      if you need more information.
    </Toast>
  );
};
