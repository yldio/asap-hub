import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';
import { ExternalAuthorResponse, UserResponse } from '@asap-hub/model';

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
        } as ExternalAuthorResponse,
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
        } as ExternalAuthorResponse,
      ]}
    />,
  );
  expect(getByText(/John Doe/).closest('a')).toBeNull();
});

describe('maximum users', () => {
  it('truncates user list when maximum exceeded and shows additional count', () => {
    const { getAllByRole, getByText } = render(
      <UsersList
        max={3}
        users={Array.from({ length: 5 }).map(
          () =>
            ({
              displayName: 'John Doe',
            } as ExternalAuthorResponse),
        )}
      />,
    );
    expect(getAllByRole('listitem').length).toEqual(4);
    expect(getByText('+2')).toBeVisible();
  });
  it('does not truncate the list at the maximum', () => {
    const { getAllByRole } = render(
      <UsersList
        max={3}
        users={Array.from({ length: 3 }).map(
          () =>
            ({
              displayName: 'John Doe',
            } as ExternalAuthorResponse),
        )}
      />,
    );
    expect(getAllByRole('listitem').length).toEqual(3);
  });
});
