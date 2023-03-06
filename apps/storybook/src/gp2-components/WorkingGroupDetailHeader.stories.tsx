import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

import { WorkingGroupDetailHeader } from '@asap-hub/gp2-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Organisms / Working Group / Detail Header',
  component: WorkingGroupDetailHeader,
};

const props = {
  ...gp2Fixtures.createWorkingGroupResponse(),
  backHref: '/',
  isWorkingGroupMember: false,
  isAdministrator: boolean('is admin', false),
};

export const Normal = () => <WorkingGroupDetailHeader {...props} />;

export const WithResources = () => (
  <WorkingGroupDetailHeader {...props} isWorkingGroupMember={true} />
);
