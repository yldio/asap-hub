import React from 'react';
import { ContentPage } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Content Page',
  component: ContentPage,
};

export const Normal = () => (
  <ContentPage
    title={text('Title', 'Title')}
    text={text('Text', '<b>Hello</b>')}
  />
);
