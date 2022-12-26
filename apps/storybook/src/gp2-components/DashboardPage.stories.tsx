import { DashboardPage } from '@asap-hub/gp2-components';
import { noop } from '@asap-hub/react-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Templates / Dashboard / Dashboard Page',
  component: DashboardPage,
};

const props = {
  firstName: 'John',
  showWelcomeBackBanner: boolean('Welcome back banner', false),
  dismissBanner: noop,
};

export const Normal = () => <DashboardPage {...props} />;
