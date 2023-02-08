import { gp2 } from '@asap-hub/fixtures';
import { DashboardPageBody } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Templates / Dashboard / Dashboard Page Body',
  component: DashboardPageBody,
};

export const Normal = () => (
  <DashboardPageBody news={gp2.createNewsResponse()} />
);
