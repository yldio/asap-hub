import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';
import { ExternalAuthorResponse } from '@asap-hub/model';
import { createUserResponse } from '@asap-hub/fixtures';

import UsersList from '../UsersList';
import { userPlaceholderIcon } from '../../icons';

it('links to an internal user', () => {
  const { getByRole } = render(
    <UsersList
      users={[
        {
          ...createUserResponse(),
          displayName: 'John',
          id: '42',
        },
      ]}
    />,
  );
  expect(getByRole('link')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('falls back to a placeholder icon for an external user', () => {
  const { getByRole } = render(
    <UsersList
      users={[
        {
          id: 'external-author-1',
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
          id: 'external-author-1',
          displayName: 'John Doe',
        } as ExternalAuthorResponse,
      ]}
    />,
  );
  expect(getByText(/John Doe/).closest('a')).toBeNull();
});

describe('alumni badge', () => {
  it('shows alumni badge for internal and alumni users', () => {
    const { getByText } = render(
      <UsersList
        max={1}
        users={Array.from({ length: 1 }).map(() => ({
          ...createUserResponse(),
          displayName: 'John Doe',
          alumniSinceDate: new Date(2021, 6, 12, 14, 32).toISOString(),
        }))}
      />,
    );
    expect(getByText('Alumni Badge')).toBeInTheDocument();
  });
  it('does not show alumni badge if user is not alumni', () => {
    const { queryByText } = render(
      <UsersList
        max={1}
        users={Array.from({ length: 1 }).map(() => ({
          ...createUserResponse(),
          displayName: 'John Doe',
        }))}
      />,
    );
    expect(queryByText('Alumni Badge')).not.toBeInTheDocument();
  });
  it('does not show alumni badge for external users', () => {
    const { queryByText } = render(
      <UsersList
        max={1}
        users={Array.from({ length: 1 }).map(
          () =>
            ({
              displayName: 'John Doe',
            } as ExternalAuthorResponse),
        )}
      />,
    );
    expect(queryByText('Alumni Badge')).not.toBeInTheDocument();
  });
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
