import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';
import UserProfilePersonalText from '../UserProfilePersonalText';

const props: ComponentProps<typeof UserProfilePersonalText> = {
  labs: [],
  teams: [],
  role: 'Grantee',
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

it.each`
  country      | city         | text
  ${undefined} | ${'City'}    | ${/City/}
  ${'Country'} | ${undefined} | ${/Country/}
  ${'Country'} | ${'City'}    | ${/City, Country/}
`('generates the location description "$text"', ({ text, ...location }) => {
  const { container, getByTitle } = render(
    <UserProfilePersonalText {...props} {...location} />,
  );
  expect(container).toHaveTextContent(text);
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

it('renders no more than 3 teams and roles', async () => {
  const { container, getByLabelText } = render(
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
        {
          id: '2',
          displayName: 'Drink',
          role: 'Collaborating PI',
        },
        {
          id: '3',
          displayName: 'Desert',
          role: 'Collaborating PI',
        },
      ]}
    />,
  );
  expect(container).toHaveTextContent(/Lead PI \(Core Leadership\) on Team/);
  expect(getByLabelText(/\+1/)).toBeVisible();
});
it('does not show team information if the user is not on a team', async () => {
  const { container } = render(<UserProfilePersonalText {...props} />);
  expect(container).not.toHaveTextContent(/\w on \w/);
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
