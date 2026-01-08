import { ComponentProps } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { enable, disable } from '@asap-hub/flags';

import TeamProfileAbout from '../TeamProfileAbout';

const props: ComponentProps<typeof TeamProfileAbout> = {
  teamDescription: '',
  tags: [],
  projectTitle: '',
  projectSummary: undefined,
  linkedProjectId: undefined,
  supplementGrant: undefined,
  members: [],
  teamListElementId: '',
  teamStatus: 'Active',
  teamType: 'Discovery Team',
  labs: [],
};
it('renders the overview', () => {
  const { getByText } = render(
    <TeamProfileAbout {...props} teamDescription="Description" />,
  );

  expect(getByText(/Team Description/i)).toBeVisible();
  expect(getByText('Description')).toBeVisible();
});

it('renders the contact banner', () => {
  const { getByRole } = render(
    <TeamProfileAbout {...props} pointOfContact="test@test.com" />,
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

it('renders the tags list when tags are present', () => {
  const { getByText } = render(
    <TeamProfileAbout
      {...props}
      teamDescription="Description"
      tags={[{ name: 'example expertise', id: '1' }]}
    />,
  );
  expect(getByText(/example expertise/i)).toBeVisible();
  expect(getByText(/tags/i)).toBeVisible();
});

it('renders the Projects card when PROJECTS_MVP is enabled and project data is present', () => {
  (isEnabled as jest.Mock).mockReturnValue(true);
  const { getByText } = render(
    <TeamProfileAbout
      {...props}
      projectTitle="Project Alpha"
      linkedProjectId="proj-1"
      projectSummary="Original grant"
      supplementGrant={{ title: 'Supp', description: 'Supplement desc' }}
    />,
  );

  expect(getByText('Projects')).toBeVisible();
  expect(getByText('Project Alpha')).toBeVisible();
  expect(getByText('Supplement desc')).toBeVisible();
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
  const pointOfContact = 'pm@asap.com';

  it('does not render the footer when there is not a point of contact', () => {
    const { queryByText, queryByTitle } = render(
      <TeamProfileAbout {...props} pointOfContact={undefined} />,
    );

    expect(queryByText('Contact')).not.toBeInTheDocument();
    expect(queryByTitle(/copy/i)).not.toBeInTheDocument();
  });

  it('renders a contact button when there is a pointOfContact', () => {
    const { getByText } = render(
      <TeamProfileAbout {...props} pointOfContact={pointOfContact} />,
    );

    expect(getByText('Contact').parentElement).toHaveAttribute(
      'href',
      'mailto:pm@asap.com',
    );
  });

  it('uses pointOfContact when PROJECTS_MVP flag is enabled', () => {
    enable('PROJECTS_MVP');
    const { getByText } = render(
      <TeamProfileAbout
        {...props}
        pointOfContact="project@example.com"
        members={[
          {
            id: 'pm-id',
            displayName: 'PM Name',
            firstName: 'PM',
            lastName: 'Name',
            email: 'pm@example.com',
            role: 'Project Manager',
          },
        ]}
      />,
    );

    expect(getByText('Contact').parentElement).toHaveAttribute(
      'href',
      'mailto:project@example.com',
    );
  });

  it('uses PM email from members when PROJECTS_MVP flag is disabled', () => {
    disable('PROJECTS_MVP');
    const { getByText } = render(
      <TeamProfileAbout
        {...props}
        pointOfContact="project@example.com"
        members={[
          {
            id: 'pm-id',
            displayName: 'PM Name',
            firstName: 'PM',
            lastName: 'Name',
            email: 'pm@example.com',
            role: 'Project Manager',
          },
        ]}
      />,
    );

    expect(getByText('Contact').parentElement).toHaveAttribute(
      'href',
      'mailto:pm@example.com',
    );
  });

  it('does not render contact button when flag is disabled and no PM exists', () => {
    disable('PROJECTS_MVP');
    const { queryByText } = render(
      <TeamProfileAbout
        {...props}
        pointOfContact="project@example.com"
        members={[]}
      />,
    );

    expect(queryByText('Contact')).not.toBeInTheDocument();
  });

  it('renders the lab list when team has labs and flag is enabled', () => {
    enable('PROJECTS_MVP');
    const { getByText, getByRole } = render(
      <TeamProfileAbout
        {...props}
        labs={[{ name: 'Lab 1', id: '1', labPrincipalInvestigatorId: '' }]}
      />,
    );

    expect(getByText('Lab 1')).toBeVisible();
    expect(getByRole('heading', { name: /labs/i })).toBeVisible();
  });

  it('does not render the lab list when team has labs but flag is disabled', () => {
    disable('PROJECTS_MVP');
    const { queryByText, queryByRole } = render(
      <TeamProfileAbout
        {...props}
        labs={[{ name: 'Lab 1', id: '1', labPrincipalInvestigatorId: '' }]}
      />,
    );

    expect(queryByText('Lab 1')).not.toBeInTheDocument();
    expect(queryByRole('heading', { name: /labs/i })).not.toBeInTheDocument();
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

  it('renders team groups card when team is active', () => {
    const { getByText } = render(
      <TeamProfileAbout
        {...props}
        teamStatus="Active"
        teamGroupsCard={<div>Groups Card</div>}
      />,
    );

    expect(getByText('Groups Card')).toBeVisible();
  });

  it('renders team groups card when team is not active', () => {
    const { getByText } = render(
      <TeamProfileAbout
        {...props}
        teamStatus="Inactive"
        teamGroupsCard={<div>Groups Card</div>}
      />,
    );

    expect(getByText('Groups Card')).toBeVisible();
  });
});
