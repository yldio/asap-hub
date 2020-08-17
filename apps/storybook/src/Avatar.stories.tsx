import React from 'react';
import { Avatar } from '@asap-hub/react-components';
import { boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Atoms / Avatar',
};

export const Normal = () => (
  <Avatar
    border={boolean('Border', false)}
    imageUrl={text(
      'Image URL',
      'https://upload.wikimedia.org/wikipedia/commons/b/b4/Wikipe-tan_avatar.png',
    )}
  />
);
export const InitialsFallback = () => (
  <Avatar
    border={boolean('Border', false)}
    firstName={text('First Name', 'John')}
    lastName={text('Last Name', 'Doe')}
  />
);
