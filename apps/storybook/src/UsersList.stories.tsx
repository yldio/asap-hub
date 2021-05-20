import React from 'react';
import { createListUserResponse } from '@asap-hub/fixtures';
import { UsersList } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Users / List',
  component: UsersList,
};

export const Normal = () => (
  <UsersList
    users={createListUserResponse(number('Number of Users', 3)).items}
  />
);
export const External = () => (
  <UsersList
    users={Array(number('Number of Users', 3))
      .fill(null)
      .map((_, i) => ({ displayName: `John Number ${i + 1}` }))}
  />
);
