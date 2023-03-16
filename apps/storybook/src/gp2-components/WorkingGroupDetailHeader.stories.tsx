import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { ComponentProps } from 'react';

import { WorkingGroupDetailHeader } from '@asap-hub/gp2-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Organisms / Working Group / Detail Header',
  component: WorkingGroupDetailHeader,
};

const props: ComponentProps<typeof WorkingGroupDetailHeader> = {
  ...gp2Fixtures.createWorkingGroupResponse(),
  isWorkingGroupMember: false,
  isAdministrator: boolean('is admin', false),
  outputsTotal: 1,
  upcomingTotal: 2,
  pastTotal: 4,
};

export const Normal = () => <WorkingGroupDetailHeader {...props} />;

export const WithResources = () => (
  <WorkingGroupDetailHeader {...props} isWorkingGroupMember={true} />
);
