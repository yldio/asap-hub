import React from 'react';
import { Tag } from '@asap-hub/react-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Tag',
};

export const Normal = () => {
  return (
    <Tag highlight={boolean('Highlight', false)}>Neurological Diseases</Tag>
  );
};

export const Highlight = () => {
  return (
    <Tag highlight={boolean('Highlight', true)}>Neurological Diseases</Tag>
  );
};
