import { ComponentProps, ReactElement } from 'react';
import {
  createWorkingGroupMembers,
  createWorkingGroupPointOfContact,
} from '@asap-hub/fixtures';
import { fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Auth0ContextCRN, useAuth0CRN } from '@asap-hub/react-context';
import { Auth0User } from '@asap-hub/auth';
import { disable } from '@asap-hub/flags';
import { WorkingGroupLeader } from '@asap-hub/model';

import WorkingGroupHeader from '../WorkingGroupHeader';

const baseProps: ComponentProps<typeof WorkingGroupHeader> = {
  membersListElementId: 'members-list-elem-id',
  id: 'id',
  title: '',
  complete: false,
  externalLink: '',
  lastModifiedDate: new Date('2021-01-01').toISOString(),
  pointOfContact: undefined,
  leaders: [],
  members: [],
};

const userProvider =
  (user: Auth0User | undefined): React.FC =>
  (props) => {
    const { result } = renderHook(useAuth0CRN);
    const ctx = result.current;

    return (
      <Auth0ContextCRN.Provider
        value={{
          ...ctx,
          loading: false,
          isAuthenticated: true,
          user,
        }}
      >
        <WorkingGroupHeader {...baseProps} {...props} title="A test group" />
      </Auth0ContextCRN.Provider>
    );
  };

it('renders the title', () => {
  const { getByText } = render(
    <WorkingGroupHeader {...baseProps} title="A test group" />,
  );
  expect(getByText('A test group')).toBeVisible();
});

it('renders CTA when pointOfContact is provided', () => {
  const { queryAllByText, rerender } = render(
    <WorkingGroupHeader
      {...baseProps}
      pointOfContact={createWorkingGroupPointOfContact()}
    />,
  );
  expect(queryAllByText('Contact PM')).toHaveLength(1);
  rerender(<WorkingGroupHeader {...baseProps} />);
  expect(queryAllByText('Contact PM')).toHaveLength(0);
});
describe('share an output button', () => {
  const testUser = {
    id: 'testuser',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    displayName: 'John Doe',
  };

  const testLeader = {
    role: 'Project Manager',
    user: testUser,
    workstreamRole: 'aWorkstreamRole',
  } as WorkingGroupLeader;

  const renderWithUser = (props: ComponentProps<typeof WorkingGroupHeader>) =>
    render(
      userProvider({
        sub: '42',
        aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
        [`${window.location.origin}/user`]: {
          ...testUser,
          onboarded: true,
          teams: [],
          algoliaApiKey: 'asdasda',
        },
      })({ ...props }) as ReactElement,
    );

  it('does not render share an output button dropdown when feature flag is enabled but user has no permission', () => {
    const { queryByText } = render(<WorkingGroupHeader {...baseProps} />);
    expect(queryByText('Share an output')).toBeNull();
  });

  it('does not render share an output button dropdown when user is project manager but feature flag is disabled', () => {
    disable('WORKING_GROUP_SHARED_OUTPUT_BTN');
    const { queryByText } = renderWithUser({
      ...baseProps,
      leaders: [testLeader],
    });
    expect(queryByText('Share an output')).toBeNull();
  });

  it('renders share an output button dropdown when user is project manager and feature flag is enabled', () => {
    const { queryByText, getByText } = renderWithUser({
      ...baseProps,
      leaders: [testLeader],
    });
    expect(queryByText(/article/i, { selector: 'span' })).not.toBeVisible();
    fireEvent.click(getByText('Share an output'));
    expect(getByText(/article/i, { selector: 'span' })).toBeVisible();
    expect(
      getByText(/article/i, { selector: 'span' }).closest('a'),
    ).toHaveAttribute(
      'href',
      '/network/working-groups/id/create-output/article',
    );
  });
});

it('renders a complete tag when complete is true', () => {
  const { queryByText, getByText, getByTitle, rerender } = render(
    <WorkingGroupHeader {...baseProps} />,
  );
  expect(queryByText('Complete')).toBeNull();
  rerender(<WorkingGroupHeader {...baseProps} complete />);
  expect(getByTitle('Success')).toBeInTheDocument();
  expect(getByText('Complete')).toBeVisible();
});

it('renders the member avatars', () => {
  const { getByLabelText } = render(
    <WorkingGroupHeader
      {...baseProps}
      members={createWorkingGroupMembers(1)}
    />,
  );
  expect(getByLabelText(/pic.+ of .+/)).toBeVisible();
});

it('renders number of members exceeding the limit of 5 and anchors it to the right place', () => {
  const { getAllByLabelText, getByLabelText, getByRole } = render(
    <WorkingGroupHeader
      {...baseProps}
      members={createWorkingGroupMembers(6)}
    />,
  );
  expect(getAllByLabelText(/pic.+ of .+/)).toHaveLength(5);
  expect(getByLabelText(/\+1/)).toBeVisible();

  expect(getByRole('link', { name: /\+1/ })).toHaveAttribute(
    'href',
    `/network/working-groups/id/about#${baseProps.membersListElementId}`,
  );
});

it('renders a Working Group Folder when externalLink is provided', () => {
  const { queryByText, getByText, rerender } = render(
    <WorkingGroupHeader {...baseProps} />,
  );
  expect(queryByText('Working Group Folder')).toBeNull();
  rerender(
    <WorkingGroupHeader {...baseProps} externalLink="http://www.hub.com" />,
  );
  expect(getByText('Working Group Folder')).toBeVisible();
});
