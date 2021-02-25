import React from 'react';
import { BackLink } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Back Link',
  component: BackLink,
};

export const Normal = () => (
  <BackLink href="#">{text('Text', 'Text')}</BackLink>
);
