import { roleIcon, NavigationLink } from '@asap-hub/gp2-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Molecules / Navigation Link',
  component: NavigationLink,
};

export const Normal = () => (
  <NavigationLink href={text('href', 'https://www.google.com')} icon={roleIcon}>
    {text('text', 'text')}
  </NavigationLink>
);
