import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { createGroupResponse, createUserResponse } from '@asap-hub/fixtures';

import GroupProfileAbout from '../GroupProfileAbout';

const props: ComponentProps<typeof GroupProfileAbout> = {
  ...createGroupResponse(),
  leaders: [],
  teams: [],
};

it('renders group information', () => {
  const { getByText } = render(
    <GroupProfileAbout {...props} description="Group Desc" />,
  );
  expect(getByText('Group Desc')).toBeVisible();
});

it('renders group tools', () => {
  const { getByText } = render(
    <GroupProfileAbout
      {...props}
      tools={{ slack: 'https://example.com/slack' }}
    />,
  );
  expect(getByText(/join slack/i).closest('a')).toHaveAttribute(
    'href',
    'https://example.com/slack',
  );
});

it('renders group members', () => {
  const { getByText } = render(
    <GroupProfileAbout
      {...props}
      leaders={[
        {
          user: {
            ...createUserResponse(),
            displayName: 'John',
            teams: [],
          },
          role: 'Chair',
        },
      ]}
    />,
  );
  expect(getByText('John')).toBeVisible();
});

it('assigns given id to the members section for deep linking', () => {
  const { container } = render(
    <GroupProfileAbout {...props} membersSectionId="members-section" />,
  );
  expect(container.querySelector('#members-section')).toHaveTextContent(
    /members/i,
  );
});

it('renders a call to action button, when PMs are defined on the group', () => {
  const { getByText } = render(
    <GroupProfileAbout
      {...props}
      leaders={[
        {
          user: {
            ...createUserResponse(),
            id: 'u0',
            displayName: 'John',
            teams: [],
            email: 'test1@test.com',
          },
          role: 'Project Manager',
        },
        {
          user: {
            ...createUserResponse(),
            id: 'u1',
            displayName: 'Johnny',
            teams: [],
            email: 'test2@test.com',
          },
          role: 'Project Manager',
        },
      ]}
    />,
  );

  expect(getByText(/contact pm/i).closest('a')).toHaveAttribute(
    'href',
    'mailto:test1@test.com,test2@test.com',
  );
});

it('does not render a call to action button, when a PM is NOT defined on the group', () => {
  const { queryByText } = render(
    <GroupProfileAbout
      {...props}
      leaders={[
        {
          user: {
            ...createUserResponse(),
            displayName: 'John',
            teams: [],
            email: 'test@test.com',
          },
          role: 'Chair',
        },
      ]}
    />,
  );

  expect(queryByText(/contact pm/i)).not.toBeInTheDocument();
});

it('renders the Teams Tabbed card for inactive groups', () => {
  render(<GroupProfileAbout {...props} active={true} />);
  expect(screen.getByText('Group Members', { selector: 'h2' })).toBeVisible();
  render(<GroupProfileAbout {...props} active={false} />);
  expect(
    screen.getByText('Interest Group Teams', { selector: 'h3' }),
  ).toBeVisible();
});
