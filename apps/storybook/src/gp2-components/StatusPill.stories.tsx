import { StatusPill } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { select } from '@storybook/addon-knobs';

export default {
  title: 'GP2 / Molecules / Status Pill',
  component: StatusPill,
};

export const Normal = () => (
  <StatusPill
    status={select<
      | gp2.ProjectResponse['status']
      | gp2.ProjectResponse['milestones'][0]['status']
    >('Status', ['Active', 'Completed', 'Inactive', 'Not Started'], 'Active')}
  />
);
