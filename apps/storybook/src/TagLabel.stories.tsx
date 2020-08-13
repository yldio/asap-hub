import React from 'react';
import { TagLabel } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Tag Label',
};

export const Normal = () => {
  return <TagLabel>{text('Text', 'Publication')}</TagLabel>;
};
