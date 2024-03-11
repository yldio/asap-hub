import { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import {
  createInterestGroupResponse,
  createUserResponse,
} from '@asap-hub/fixtures';

import InterestGroupProfileAbout from '../InterestGroupProfileAbout';

const props: ComponentProps<typeof InterestGroupProfileAbout> = {
  ...createInterestGroupResponse(),
  leaders: [],
  teams: [],
};

it('renders group information', () => {
  const { getByText } = render(
    <InterestGroupProfileAbout {...props} description="Group Desc" />,
  );
  expect(getByText('Group Desc')).toBeVisible();
});

it('renders group members', () => {
  const { getByText } = render(
    <InterestGroupProfileAbout
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
    <InterestGroupProfileAbout {...props} membersSectionId="members-section" />,
  );
  const membersSection = container.querySelector('#members-section');
  expect(membersSection).toHaveTextContent(/leaders/i);
  expect(membersSection).toHaveTextContent(/teams/i);
});

it('renders a call to action button, when PMs are defined on the group', () => {
  const { getByText } = render(
    <InterestGroupProfileAbout
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
    <InterestGroupProfileAbout
      {...props}
      contactEmails={[]}
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

it('does not render a call to action button, when a PM is defined but group is inactive', () => {
  const { queryByText } = render(
    <InterestGroupProfileAbout
      {...props}
      active={false}
      contactEmails={[]}
      leaders={[
        {
          user: {
            ...createUserResponse(),
            displayName: 'John',
            teams: [],
            email: 'test@test.com',
          },
          role: 'Project Manager',
        },
      ]}
    />,
  );

  expect(queryByText(/contact pm/i)).not.toBeInTheDocument();
});

it('renders the Teams Tabbed card', () => {
  render(<InterestGroupProfileAbout {...props} active={true} />);
  expect(
    screen.getByText('Interest Group Teams', { selector: 'h3' }),
  ).toBeVisible();
});

it('renders the Leaders Tabbed card', () => {
  render(<InterestGroupProfileAbout {...props} active={true} />);
  expect(
    screen.getByText('Interest Group Leaders', { selector: 'h3' }),
  ).toBeVisible();
});
