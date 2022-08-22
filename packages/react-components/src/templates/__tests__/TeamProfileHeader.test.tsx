import { createTeamResponseMembers } from '@asap-hub/fixtures';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { formatISO } from 'date-fns';
import { ComponentProps } from 'react';
import TeamProfileHeader from '../TeamProfileHeader';

const boilerplateProps: ComponentProps<typeof TeamProfileHeader> = {
  id: '42',
  displayName: 'John, D',
  projectTitle: 'Unknown',
  members: [],
  expertiseAndResourceTags: [],
  lastModifiedDate: formatISO(new Date()),
  teamListElementId: '',
  labCount: 15,
  upcomingEventsCount: 0,
  pastEventsCount: 0,
};

it('renders the name as the top-level heading', () => {
  render(<TeamProfileHeader {...boilerplateProps} displayName="John, D" />);

  expect(screen.getByRole('heading')).toHaveTextContent('John, D');
  expect(screen.getByRole('heading').tagName).toBe('H1');
});

it('renders a list of members', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      members={[
        {
          id: '42',
          displayName: 'Unknown',
          email: 'foo@bar.com',
          avatarUrl: 'https://example.com',
          role: 'Collaborating PI',
        },
      ]}
    />,
  );
  expect(screen.getAllByRole('img')).toHaveLength(1);
});

it('renders no more than 5 members', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      members={createTeamResponseMembers({ teamMembers: 6 })}
    />,
  );
  expect(screen.getAllByLabelText(/pic.+ of .+/)).toHaveLength(5);
  expect(screen.getByLabelText(/\+1/)).toBeVisible();
});

it('renders a contact button when there is a pointOfContact', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
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

  expect(screen.getByText('Contact PM').parentElement).toHaveAttribute(
    'href',
    'mailto:test@test.com',
  );
});

it('renders a lab count for multiple labs', () => {
  render(<TeamProfileHeader {...boilerplateProps} labCount={23} />);

  expect(screen.getByText(/23 Labs/i)).toBeVisible();
});

it('renders a lab count for a single lab using singular form', () => {
  render(<TeamProfileHeader {...boilerplateProps} labCount={1} />);

  expect(screen.getByText(/1 Lab(?!s)/i)).toBeVisible();
});

it('does not display labs when 0 labs are available', () => {
  render(<TeamProfileHeader {...boilerplateProps} labCount={0} />);

  expect(screen.queryByText(/Labs/i)).toBeNull();
});

it('renders tabs', () => {
  render(<TeamProfileHeader {...boilerplateProps} />);
  expect(
    screen.getAllByRole('link').map(({ textContent }) => textContent),
  ).toEqual([
    'About',
    'Shared Outputs (0)',
    'Upcoming Events (0)',
    'Past Events (0)',
  ]);
});

it('renders workspace tabs when tools provided', () => {
  render(
    <TeamProfileHeader
      {...boilerplateProps}
      tools={[{ name: '', description: '', url: '' }]}
    />,
  );
  expect(
    screen.getAllByRole('link').map(({ textContent }) => textContent),
  ).toEqual([
    'About',
    'Team Workspace',
    'Shared Outputs (0)',
    'Upcoming Events (0)',
    'Past Events (0)',
  ]);
});

it('renders share an output button dropdown', () => {
  render(
    <ResearchOutputPermissionsContext.Provider
      value={{ canCreateUpdate: true }}
    >
      <TeamProfileHeader {...boilerplateProps} />,
    </ResearchOutputPermissionsContext.Provider>,
  );
  expect(
    screen.queryByText(/article/i, { selector: 'span' }),
  ).not.toBeVisible();
  fireEvent.click(screen.getByText('Share an output'));
  expect(screen.getByText(/article/i, { selector: 'span' })).toBeVisible();
});

it('displays upcoming event count', () => {
  render(<TeamProfileHeader {...boilerplateProps} upcomingEventsCount={11} />);

  const link = screen.getByRole('link', { name: /upcoming events \(11\)/i });
  expect(link).toBeVisible();
});

it('displays past event count', () => {
  render(<TeamProfileHeader {...boilerplateProps} pastEventsCount={11} />);

  expect(screen.getByText('Past Events (11)')).toBeVisible();
});

it('displays shared output count', () => {
  render(<TeamProfileHeader {...boilerplateProps} sharedOutputsCount={11} />);

  expect(screen.getByText('Shared Outputs (11)')).toBeVisible();
});
