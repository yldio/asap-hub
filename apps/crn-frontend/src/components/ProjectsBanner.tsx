import { Toast } from '@asap-hub/react-components';
import { useFlags } from '@asap-hub/react-context';
import { useDismissable } from '../hooks';

const PROJECTS_BANNER_DISMISSED_KEY = 'crn-projects-banner-dismissed';

export const ProjectsBanner = () => {
  const { isEnabled } = useFlags();
  const [isDismissed, handleDismiss] = useDismissable(
    PROJECTS_BANNER_DISMISSED_KEY,
  );

  // Only show banner if PROJECTS_MVP flag is enabled and not dismissed
  if (!isEnabled('PROJECTS_MVP') || isDismissed) {
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
