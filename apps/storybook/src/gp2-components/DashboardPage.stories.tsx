import { DashboardPage } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Templates / Dashboard Page',
  component: DashboardPage,
};

const props = {
  firstName: 'John Doe',
};

export const Normal = () => <DashboardPage {...props} />;
