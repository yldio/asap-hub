import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';
import { ExternalAuthor, UserResponse } from '@asap-hub/model';

import UsersList from '../UsersList';
import { userPlaceholderIcon } from '../../icons';

it('links to an internal user', () => {
  const { getByText } = render(
    <UsersList users={[{ id: '42', displayName: 'John' } as UserResponse]} />,
  );
  expect(getByText('John').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('falls back to a placeholder icon for an external user', () => {
  const { getByRole } = render(
    <UsersList
      users={[
        {
          displayName: 'John Doe',
        } as ExternalAuthor,
      ]}
    />,
  );
  expect(getComputedStyle(getByRole('img')).backgroundImage).toContain(
    btoa(renderToStaticMarkup(userPlaceholderIcon)),
  );
});

it('does not link external users', () => {
  const { getByText } = render(
    <UsersList
      users={[
        {
          displayName: 'John Doe',
        } as ExternalAuthor,
      ]}
    />,
  );
  expect(getByText(/john doe/i).closest('a')).toBeNull();
});
