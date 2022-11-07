import { createWorkingGroupResponse } from '@asap-hub/fixtures';
import { DeliverablesCard } from '@asap-hub/react-components';
import { number, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Deliverables Card',
};
export const Normal = () => {
  const props = createWorkingGroupResponse({
    deliverables: number('Deliverables', 6),
  });

  return (
    <DeliverablesCard
      limit={number('Limit', 4)}
      deliverables={props.deliverables.map((item, index) =>
        index === 0
          ? {
              ...item,
              description: text(
                'First Description',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tincidunt mauris vitae faucibus convallis. Donec sodales faucibus dolor sit amet consequat.',
              ),
            }
          : item,
      )}
    />
  );
};
