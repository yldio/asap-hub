import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';
import UserProfilePersonalText from '../UserProfilePersonalText';

const props: ComponentProps<typeof UserProfilePersonalText> = {
  labs: [],
  teams: [],
  userActiveTeamsRoute: '#',
};

it.each`
  jobTitle     | institution  | text
  ${undefined} | ${'Inst'}    | ${/Inst/}
  ${'Job'}     | ${undefined} | ${/Job/}
  ${'Job'}     | ${'Inst'}    | ${/Job at Inst/}
`('generates the position description "$text"', ({ text, ...position }) => {
  const { container } = render(
    <UserProfilePersonalText {...props} {...position} />,
  );
  expect(container).toHaveTextContent(text);
});

it('shows user location', () => {
  const { container, getByTitle } = render(
    <UserProfilePersonalText
      {...props}
      city="Toronto"
      stateOrProvince="Ontario"
      country="Canada"
    />,
  );
  expect(container).toHaveTextContent('Toronto, Ontario, Canada');
  expect(getByTitle(/location/i)).toBeInTheDocument();
});

it('does not show the location icon if no location is available', () => {
  const { queryByTitle } = render(<UserProfilePersonalText {...props} />);
  expect(queryByTitle(/location/i)).toBe(null);
});

it("generates information about the user's team", async () => {
  const { container } = render(
    <UserProfilePersonalText
      {...props}
      teams={[
        {
          id: '42',
          displayName: 'Team',
          role: 'Lead PI (Core Leadership)',
        },
        {
          id: '1337',
          displayName: 'Meat',
          role: 'Collaborating PI',
        },
      ]}
    />,
  );
  expect(container).toHaveTextContent(/Lead PI \(Core Leadership\) on Team/);
});

it('only show lab information if the user is on a lab', async () => {
  const { container, rerender } = render(
    <UserProfilePersonalText {...props} />,
  );
  expect(container).not.toHaveTextContent('Lab');

  rerender(
    <UserProfilePersonalText
      {...props}
      labs={[{ id: 'cd7be4905', name: 'Glasgow' }]}
    />,
  );
  expect(container).toHaveTextContent('Glasgow Lab');
});
it('shows placeholder text on your own profile', () => {
  const { queryByTitle, queryByText, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <UserProfilePersonalText
        {...props}
        city={undefined}
        country={undefined}
      />
    </UserProfileContext.Provider>,
  );
  expect(queryByTitle(/location/i)).not.toBeInTheDocument();
  expect(queryByText(/your position/i)).not.toBeInTheDocument();

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfilePersonalText {...props} labs={[]} />
    </UserProfileContext.Provider>,
  );
  expect(queryByTitle(/location/i)).toBeInTheDocument();
  expect(queryByText(/your position/i)).toBeInTheDocument();
});

it('renders tags when present', async () => {
  const { queryByText, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <UserProfilePersonalText
        {...props}
        tags={[
          { id: '1', name: 'Tag 1' },
          { id: '2', name: 'Tag 2' },
        ]}
      />
    </UserProfileContext.Provider>,
  );

  expect(queryByText('Tag 1')).toBeInTheDocument();
  expect(queryByText('Tag 2')).toBeInTheDocument();

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfilePersonalText {...props} tags={[]} />
    </UserProfileContext.Provider>,
  );

  expect(queryByText('Tag 1')).not.toBeInTheDocument();
  expect(queryByText('Tag 2')).not.toBeInTheDocument();
});

it('renders active teams with roles', () => {
  const { container } = render(
    <UserProfilePersonalText
      {...props}
      teams={[
        {
          id: '42',
          displayName: 'Alpha',
          role: 'Lead PI (Core Leadership)',
        },
        {
          id: '1337',
          displayName: 'Beta',
          role: 'Collaborating PI',
        },
      ]}
    />,
  );

  expect(container).toHaveTextContent(
    'Lead PI (Core Leadership) on Team Alpha',
  );
  expect(container).toHaveTextContent('Collaborating PI on Team Beta');
});

it('shows "View all roles" link when there are more than 2 active teams', () => {
  const { getByText } = render(
    <UserProfilePersonalText
      {...props}
      teams={[
        { id: '1', displayName: 'Team A', role: 'Lead PI (Core Leadership)' },
        { id: '2', displayName: 'Team B', role: 'Collaborating PI' },
        { id: '3', displayName: 'Team C', role: 'Project Manager' },
      ]}
    />,
  );

  expect(getByText('View all roles')).toBeInTheDocument();
});

it('does not show "View all roles" link when there are 2 or fewer active teams', () => {
  const { queryByText } = render(
    <UserProfilePersonalText
      {...props}
      teams={[
        { id: '1', displayName: 'Team A', role: 'Lead PI (Core Leadership)' },
        { id: '2', displayName: 'Team B', role: 'Collaborating PI' },
      ]}
    />,
  );

  expect(queryByText('View all roles')).not.toBeInTheDocument();
});

it('renders inactive teams as "Former Roles" when user is alumni', () => {
  const { container, getByText } = render(
    <UserProfilePersonalText
      {...props}
      isAlumni={true}
      teams={[
        {
          id: '42',
          displayName: 'Former',
          role: 'Lead PI (Core Leadership)',
        },
      ]}
    />,
  );

  expect(getByText('Former Roles')).toBeInTheDocument();
  expect(container).toHaveTextContent(
    'Lead PI (Core Leadership) on Team Former',
  );
});

it('renders inactive teams as "Former Roles" when teams have inactive dates', () => {
  const { container, getByText } = render(
    <UserProfilePersonalText
      {...props}
      teams={[
        {
          id: '42',
          displayName: 'Inactive',
          role: 'Collaborating PI',
          teamInactiveSince: '2023-01-01',
        },
      ]}
    />,
  );

  expect(getByText('Former Roles')).toBeInTheDocument();
  expect(container).toHaveTextContent('Collaborating PI on Team Inactive');
});

it('shows "View all former roles" link when there are more than 2 inactive teams', () => {
  const { getByText } = render(
    <UserProfilePersonalText
      {...props}
      isAlumni={true}
      teams={[
        { id: '1', displayName: 'Former A', role: 'Lead PI (Core Leadership)' },
        { id: '2', displayName: 'Former B', role: 'Collaborating PI' },
        { id: '3', displayName: 'Former C', role: 'Project Manager' },
      ]}
    />,
  );

  expect(getByText('View all former roles')).toBeInTheDocument();
});

it('does not show "View all former roles" link when there are 2 or fewer inactive teams', () => {
  const { queryByText } = render(
    <UserProfilePersonalText
      {...props}
      isAlumni={true}
      teams={[
        { id: '1', displayName: 'Former A', role: 'Lead PI (Core Leadership)' },
        { id: '2', displayName: 'Former B', role: 'Collaborating PI' },
      ]}
    />,
  );

  expect(queryByText('View all former roles')).not.toBeInTheDocument();
});

it('separates active and inactive teams correctly', () => {
  const { container, getByText } = render(
    <UserProfilePersonalText
      {...props}
      teams={[
        {
          id: '1',
          displayName: 'Active',
          role: 'Lead PI (Core Leadership)',
        },
        {
          id: '2',
          displayName: 'Inactive',
          role: 'Collaborating PI',
          teamInactiveSince: '2023-01-01',
        },
      ]}
    />,
  );

  expect(container).toHaveTextContent(
    'Lead PI (Core Leadership) on Team Active',
  );
  expect(getByText('Former Roles')).toBeInTheDocument();
  expect(container).toHaveTextContent('Collaborating PI on Team Inactive');
});

it('handles teams with inactiveSinceDate property', () => {
  const { container, getByText } = render(
    <UserProfilePersonalText
      {...props}
      teams={[
        {
          id: '1',
          displayName: 'Inactive',
          role: 'Project Manager',
          inactiveSinceDate: '2023-06-01',
        },
      ]}
    />,
  );

  expect(getByText('Former Roles')).toBeInTheDocument();
  expect(container).toHaveTextContent('Project Manager on Team Inactive');
});

it('does not show "Former Roles" section when there are no inactive teams', () => {
  const { queryByText } = render(
    <UserProfilePersonalText
      {...props}
      teams={[
        {
          id: '1',
          displayName: 'Active',
          role: 'Lead PI (Core Leadership)',
        },
      ]}
    />,
  );

  expect(queryByText('Former Roles')).not.toBeInTheDocument();
});

it('handles "View all roles" click event', () => {
  const mockScrollIntoView = jest.fn();
  const mockElement = {
    scrollIntoView: mockScrollIntoView,
  } as unknown as HTMLElement;
  const mockGetElementById = jest.fn(() => mockElement);

  document.getElementById = mockGetElementById;

  const { getByText } = render(
    <UserProfilePersonalText
      {...props}
      teams={[
        { id: '1', displayName: 'Team A', role: 'Lead PI (Core Leadership)' },
        { id: '2', displayName: 'Team B', role: 'Collaborating PI' },
        { id: '3', displayName: 'Team C', role: 'Project Manager' },
      ]}
    />,
  );

  const viewAllLink = getByText('View all roles');
  viewAllLink.click();

  expect(mockGetElementById).toHaveBeenCalledWith('user-teams-tabbed-card');
  expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
});

it('handles "View all former roles" click event', () => {
  const mockScrollIntoView = jest.fn();
  const mockElement = {
    scrollIntoView: mockScrollIntoView,
  } as unknown as HTMLElement;
  const mockGetElementById = jest.fn(() => mockElement);

  document.getElementById = mockGetElementById;

  const { getByText } = render(
    <UserProfilePersonalText
      {...props}
      isAlumni={true}
      teams={[
        { id: '1', displayName: 'Former A', role: 'Lead PI (Core Leadership)' },
        { id: '2', displayName: 'Former B', role: 'Collaborating PI' },
        { id: '3', displayName: 'Former C', role: 'Project Manager' },
      ]}
    />,
  );

  const viewAllLink = getByText('View all former roles');
  viewAllLink.click();

  expect(mockGetElementById).toHaveBeenCalledWith('user-teams-tabbed-card');
  expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
});
