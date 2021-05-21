import { render } from '@testing-library/react';

import UserProfilePlaceholderCard from '../UserProfilePlaceholderCard';

it('render a title and description', () => {
  const { getByRole, getByText } = render(
    <UserProfilePlaceholderCard title="Title">
      Description
    </UserProfilePlaceholderCard>,
  );

  expect(getByRole('heading').textContent).toEqual('Title');
  expect(getByText(/description/i)).toBeVisible();
});
