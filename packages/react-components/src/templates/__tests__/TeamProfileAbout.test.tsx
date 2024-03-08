import { ComponentProps } from 'react';
import { TeamRole } from '@asap-hub/model';
import { fireEvent, render } from '@testing-library/react';

import TeamProfileAbout from '../TeamProfileAbout';

const props: ComponentProps<typeof TeamProfileAbout> = {
  projectTitle: '',
  tags: [],
  members: [],
  teamListElementId: '',
};
it('renders the overview', () => {
  const { getByText } = render(
    <TeamProfileAbout {...props} projectTitle="Title" />,
  );

  expect(getByText(/overview/i)).toBeVisible();
  expect(getByText('Title')).toBeVisible();
});

it('renders the contact banner', () => {
  const { getByRole } = render(
    <TeamProfileAbout
      {...props}
      pointOfContact={{
        id: 'uuid',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        role: 'Project Manager',
      }}
    />,
  );

  const link = getByRole('link');
  expect(link).toBeVisible();
  expect(link).toHaveAttribute('href', 'mailto:test@test.com');
});

it('renders the team list', () => {
  const { getByText } = render(
    <TeamProfileAbout
      {...props}
      members={[
        {
          id: 'uuid',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager',
          email: 'johndoe@asap.com',
        },
      ]}
    />,
  );

  const avatar = getByText(/john doe/i);
  expect(avatar).toBeVisible();
  expect(avatar.closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/uuid/i),
  );
  expect(getByText('Project Manager')).toBeInTheDocument();
});
it('shows the lab list when present on member list', () => {
  const { queryByText, rerender } = render(
    <TeamProfileAbout
      {...props}
      members={[
        {
          id: 'uuid',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager',
          email: 'johndoe@asap.com',
        },
      ]}
    />,
  );
  expect(queryByText('Lab')).not.toBeInTheDocument();
  rerender(
    <TeamProfileAbout
      {...props}
      members={[
        {
          id: 'uuid',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager',
          email: 'johndoe@asap.com',
          labs: [{ name: 'Doe', id: '1' }],
        },
      ]}
    />,
  );
  expect(queryByText('Doe Lab')).toBeInTheDocument();
});

it('renders the expertise and resources list', () => {
  const { getByText, queryByText } = render(
    <TeamProfileAbout
      {...props}
      tags={[{ name: 'example expertise', id: '1' }]}
    />,
  );
  expect(getByText(/example expertise/i)).toBeVisible();
  expect(queryByText(/expertise and resources/i)).toBeNull();
  expect(getByText(/tags/i)).toBeVisible();
});

it('renders the Teams Tabbed card when team is inactive and there are members', () => {
  const { getByText } = render(
    <TeamProfileAbout
      {...props}
      members={[
        {
          id: 'uuid',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager',
          email: 'johndoe@asap.com',
        },
      ]}
      inactiveSince="2022-10-25"
    />,
  );

  expect(getByText('Team Members', { selector: 'h3' })).toBeVisible();
  expect(getByText('Past Team Members (1)', { selector: 'p' })).toBeVisible();
});

it('renders the Teams Tabbed card when team is inactive and there isnt any members', () => {
  const { getByText } = render(
    <TeamProfileAbout {...props} members={[]} inactiveSince="2022-10-25" />,
  );

  expect(getByText('Team Members', { selector: 'h3' })).toBeVisible();
  expect(
    getByText('There are no past team members.', { selector: 'p' }),
  ).toBeVisible();
});

it('renders team members section when team is active and there are members', () => {
  const { getByText } = render(
    <TeamProfileAbout
      {...props}
      members={[
        {
          id: 'uuid',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager',
          email: 'johndoe@asap.com',
        },
      ]}
      inactiveSince={undefined}
    />,
  );

  expect(getByText('Active Team Members (1)', { selector: 'p' })).toBeVisible();
});

it('renders team members section when team is active and there isnt any members', () => {
  const { queryByText } = render(
    <TeamProfileAbout {...props} members={[]} inactiveSince={undefined} />,
  );

  expect(queryByText('Active Team Members (0)')).toBeVisible();
});

describe('footer', () => {
  const originalNavigator = window.navigator;
  Object.assign(window.navigator, {
    clipboard: {
      writeText: () => {},
    },
  });

  beforeEach(() => {
    jest.spyOn(window.navigator.clipboard, 'writeText');
  });
  afterEach(() => {
    Object.assign(window.navigator, originalNavigator);
  });
  const pointOfContact = {
    id: 'uuid',
    displayName: 'Patricia Mendes',
    firstName: 'Patricia',
    lastName: 'Mendes',
    role: 'Project Manager' as TeamRole,
    email: 'pm@asap.com',
  };

  it('does not render the footer when there is not a point of contact', () => {
    const { queryByText, queryByTitle } = render(
      <TeamProfileAbout {...props} pointOfContact={undefined} />,
    );

    expect(queryByText('Contact PM')).not.toBeInTheDocument();
    expect(queryByTitle(/copy/i)).not.toBeInTheDocument();
  });

  it('renders a contact button when there is a pointOfContact', () => {
    const { getByText } = render(
      <TeamProfileAbout {...props} pointOfContact={pointOfContact} />,
    );

    expect(getByText('Contact PM').parentElement).toHaveAttribute(
      'href',
      'mailto:pm@asap.com',
    );
  });

  it('adds the pm email to clipboard when user clicks on copy button', () => {
    const { getByTitle } = render(
      <TeamProfileAbout {...props} pointOfContact={pointOfContact} />,
    );

    fireEvent.click(getByTitle(/copy/i));
    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
      expect.stringMatching(/pm@asap.com/i),
    );
  });
});
