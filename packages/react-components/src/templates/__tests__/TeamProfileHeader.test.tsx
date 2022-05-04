import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { formatISO } from 'date-fns';
import { createTeamResponseMembers } from '@asap-hub/fixtures';
import { fireEvent } from '@testing-library/dom';

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
};

it('renders the name as the top-level heading', () => {
  const { getByRole } = render(
    <TeamProfileHeader {...boilerplateProps} displayName="John, D" />,
  );

  expect(getByRole('heading')).toHaveTextContent('John, D');
  expect(getByRole('heading').tagName).toBe('H1');
});

it('renders a list of members', () => {
  const { getAllByRole } = render(
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
  expect(getAllByRole('img')).toHaveLength(1);
});

it('renders no more than 5 members', () => {
  const { getByLabelText, getAllByLabelText } = render(
    <TeamProfileHeader
      {...boilerplateProps}
      members={createTeamResponseMembers({ teamMembers: 6 })}
    />,
  );
  expect(getAllByLabelText(/pic.+ of .+/)).toHaveLength(5);
  expect(getByLabelText(/\+1/)).toBeVisible();
});

it('renders a contact button when there is a pointOfContact', () => {
  const { getByText } = render(
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

  expect(getByText('Contact PM').parentElement).toHaveAttribute(
    'href',
    'mailto:test@test.com',
  );
});

it('renders a lab count for multiple labs', () => {
  const { getByText } = render(
    <TeamProfileHeader {...boilerplateProps} labCount={23} />,
  );

  expect(getByText(/23 Labs/i)).toBeVisible();
});

it('renders a lab count for a single lab using singular form', () => {
  const { getByText } = render(
    <TeamProfileHeader {...boilerplateProps} labCount={1} />,
  );

  expect(getByText(/1 Lab(?!s)/i)).toBeVisible();
});

it('does not display labs when 0 labs are available', () => {
  const { queryByText } = render(
    <TeamProfileHeader {...boilerplateProps} labCount={0} />,
  );

  expect(queryByText(/Labs/i)).toBeNull();
});

it('renders tabs', () => {
  const { getAllByRole } = render(<TeamProfileHeader {...boilerplateProps} />);
  expect(getAllByRole('link').map(({ textContent }) => textContent)).toEqual([
    'About',
    'Team Outputs',
  ]);
});

it('renders workspace tabs when tools provided', () => {
  const { getAllByRole } = render(
    <TeamProfileHeader
      {...boilerplateProps}
      tools={[{ name: '', description: '', url: '' }]}
    />,
  );
  expect(getAllByRole('link').map(({ textContent }) => textContent)).toEqual([
    'About',
    'Team Workspace',
    'Team Outputs',
  ]);
});

it('renders share an output button dropdown', () => {
  const { getByText, queryByText } = render(
    <ResearchOutputPermissionsContext.Provider value={{ canCreate: true }}>
      <TeamProfileHeader {...boilerplateProps} />,
    </ResearchOutputPermissionsContext.Provider>,
  );
  expect(queryByText(/article/i, { selector: 'span' })).not.toBeVisible();
  fireEvent.click(getByText('Share an output'));
  expect(queryByText(/article/i, { selector: 'span' })).toBeVisible();
});
