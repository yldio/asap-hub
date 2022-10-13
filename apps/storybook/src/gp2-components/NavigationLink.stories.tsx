import roleIcon from '@asap-hub/gp2-components/src/icons/role-icon';
import IconWithLabel from '@asap-hub/gp2-components/src/molecules/IconWithLabel';
import NavigationLink from '@asap-hub/gp2-components/src/molecules/NavigationLink';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Molecules / Navigation Link',
  component: IconWithLabel,
};
export const Logo = () => (
  <NavigationLink href={text('href', 'https://www.google.com')} icon={roleIcon}>
    {text(
      'description',
      'In order to show you the Hub, we will need to make your profile public to the Hub network. Would you like to continue?',
    )}
  </NavigationLink>
);
