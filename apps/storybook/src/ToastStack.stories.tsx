import React from 'react';
import { ToastStack } from '@asap-hub/react-components';

import { toastGenerator } from './toast';

export default {
  title: 'Organisms / Toast Stack',
  component: ToastStack,
};

export const Normal = () => {
  const { numToasts, ToastGenerator } = toastGenerator();
  return (
    <ToastStack key={numToasts}>
      <ToastGenerator />
      content
    </ToastStack>
  );
};
