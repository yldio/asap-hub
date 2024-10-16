import { StatusButton } from '@asap-hub/react-components';
import type { Meta } from '@storybook/react';
import { StoryObj } from '@storybook/react';
import { useState } from 'react';

const statusItems = [
  'Waiting for Report',
  'Review Compliance Report',
  'Waiting for ASAP Reply',
  "Waiting for Grantee's Reply",
  'Manuscript Resubmitted',
  'Submit Final Publication',
  'Addendum Required',
  'Compliant',
  'Closed (other)',
];

const meta: Meta<typeof StatusButton> = {
  title: 'Molecules / Status Button',
  component: ({ canEdit }) => {
    const [selectedStatus, setSelectedStatus] = useState(statusItems[0]);
    return (
      <StatusButton buttonChildren={() => selectedStatus} canEdit={canEdit}>
        {statusItems.map((statusItem) => ({
          item: statusItem,
          onClick: () => {
            setSelectedStatus(statusItem);
          },
        }))}
      </StatusButton>
    );
  },
};

export default meta;

type Story = StoryObj<typeof StatusButton>;

export const Normal: Story = {
  args: {
    canEdit: true,
  },
};
