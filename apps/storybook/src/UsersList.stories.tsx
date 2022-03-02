import { createListUserResponse } from '@asap-hub/fixtures';
import { ExternalAuthorResponse } from '@asap-hub/model';
import { UsersList } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Users / List',
  component: UsersList,
};

export const Normal = () => (
  <UsersList
    users={createListUserResponse(number('Number of Users', 3)).items}
    max={number('Max Authors', 3)}
  />
);
export const External = () => (
  <UsersList
    users={Array(number('Number of Users', 3))
      .fill(null)
      .map(
        (_, i): ExternalAuthorResponse => ({
          id: `external-author-${i + 1}`,
          displayName: `John Number ${i + 1}`,
        }),
      )}
  />
);
