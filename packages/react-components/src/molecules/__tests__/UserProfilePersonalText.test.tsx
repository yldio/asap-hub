import React from 'react';
import { render } from '@testing-library/react';
import UserProfilePersonalText from '../UserProfilePersonalText';

it.each`
  jobTitle     | institution  | text
  ${undefined} | ${'Inst'}    | ${/Inst/}
  ${'Job'}     | ${undefined} | ${/Job/}
  ${'Job'}     | ${'Inst'}    | ${/Job at Inst/}
`('generates the position description "$text"', ({ text, ...position }) => {
  const { container } = render(
    <UserProfilePersonalText teams={[]} {...position} />,
  );
  expect(container).toHaveTextContent(text);
});

it('shows the location', async () => {
  const { getByText, getByTitle } = render(
    <UserProfilePersonalText location="New York" teams={[]} role={'Grantee'} />,
  );
  expect(getByText('New York')).toBeVisible();
  expect(getByTitle(/location/i)).toBeInTheDocument();
});
it('does not show the location icon if no location is available', () => {
  const { queryByTitle } = render(
    <UserProfilePersonalText
      location={undefined}
      teams={[]}
      role={'Grantee'}
    />,
  );
  expect(queryByTitle(/location/i)).toBe(null);
});

it("generates information about the user's team", async () => {
  const { container } = render(
    <UserProfilePersonalText
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
      role={'Grantee'}
    />,
  );
  expect(container).toHaveTextContent(/Lead PI \(Core Leadership\) on Team/);
});
it('does not show team information if the user is not on a team', async () => {
  const { container } = render(
    <UserProfilePersonalText teams={[]} role={'Grantee'} />,
  );
  expect(container).not.toHaveTextContent(/\w on \w/);
});
