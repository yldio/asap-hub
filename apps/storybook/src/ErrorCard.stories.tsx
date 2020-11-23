import React from 'react';
import { text } from '@storybook/addon-knobs';

import { ErrorCard } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Error Card',
  component: ErrorCard,
};

export const PlainText = () => (
  <ErrorCard>{text('Text', 'Something went wrong!')}</ErrorCard>
);

export const ApplicationError = () => (
  <ErrorCard
    error={Object.assign(new Error(), {
      name: text('Name', 'BasicError'),
      message: text('Message', 'Failed to get data'),
    })}
  ></ErrorCard>
);
