import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { WorkingGroupOverview } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Templates / Working Group Overview',
  component: WorkingGroupOverview,
};

const item = gp2Fixtures.createWorkingGroupResponse();

export const Normal = () => <WorkingGroupOverview {...item} />;
