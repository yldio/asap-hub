import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { WorkingGroupResources } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Templates / Working Groups / Resources',
  component: WorkingGroupResources,
};

const item = gp2Fixtures.createWorkingGroupResponse();

export const Normal = () => <WorkingGroupResources {...item} />;
export const Administrator = () => (
  <WorkingGroupResources {...item} add={'/add'} edit={'/edit'} />
);
