import { UsersPageBody } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { number } from '@storybook/addon-knobs';
import { ComponentProps } from 'react';

export default {
  title: 'GP2 / Organisms / User Directory / UsersPageBody',
  component: UsersPageBody,
};

const item: gp2.UserResponse = {
  createdDate: '2020-03-03',
  email: 'pmars@email.com',
  firstName: 'Phillip',
  displayName: 'Phillip Mars',
  id: 'u42',
  lastName: 'Mars',
  region: 'Europe' as const,
  role: 'Network Collaborator' as const,
};

const userProps = (): ComponentProps<typeof UsersPageBody> => {
  const numberOfItems = number('Number of Users', 2, { min: 0 });
  const currentPageIndex = number('Current Page', 1, { min: 1 }) - 1;

  return {
    numberOfPages: Math.max(1, Math.ceil(numberOfItems / 10)),
    currentPageIndex,
    renderPageHref: (index) => `#${index}`,
    users: {
      total: numberOfItems,
      items: Array.from({ length: numberOfItems }, (_, i) => item).slice(
        currentPageIndex * 10,
        currentPageIndex * 10 + 10,
      ),
    },
  };
};

export const Normal = () => <UsersPageBody {...userProps()} />;
