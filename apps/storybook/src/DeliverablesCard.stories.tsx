import { createWorkingGroupResponse } from '@asap-hub/fixtures';
import { DeliverablesCard } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Deliverables Card',
};
export const Normal = () => (
  <DeliverablesCard
    limit={number('Limit', 4)}
    {...createWorkingGroupResponse({ deliverables: number('Deliverables', 6) })}
  />
);
