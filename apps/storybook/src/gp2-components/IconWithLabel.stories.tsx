import projectIcon from '@asap-hub/gp2-components/src/icons/project-icon';
import IconWithLabel from '@asap-hub/gp2-components/src/molecules/IconWithLabel';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Molecules / Icon With Label',
  component: IconWithLabel,
};
export const Logo = () => (
  <IconWithLabel icon={projectIcon}>
    {text(
      'description',
      'In order to show you the Hub, we will need to make your profile public to the Hub network. Would you like to continue?',
    )}
  </IconWithLabel>
);
