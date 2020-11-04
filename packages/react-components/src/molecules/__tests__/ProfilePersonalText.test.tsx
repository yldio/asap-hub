import React from 'react';
import { render } from '@testing-library/react';
import ProfilePersonalText from '../ProfilePersonalText';

it.each`
  jobTitle     | institution  | department   | text
  ${undefined} | ${'Inst'}    | ${'Dep'}     | ${/Inst, Dep/}
  ${'Job'}     | ${undefined} | ${'Dep'}     | ${/Job/}
  ${'Job'}     | ${'Inst'}    | ${undefined} | ${/Job at Inst/}
  ${'Job'}     | ${'Inst'}    | ${'Dep'}     | ${/Job at Inst, Dep/}
`('generates the position description "$text"', ({ text, ...position }) => {
  const { container } = render(
    <ProfilePersonalText teams={[]} {...position} />,
  );
  expect(container).toHaveTextContent(text);
});

it('shows the location', async () => {
  const { getByText, getByTitle } = render(
    <ProfilePersonalText
      location="New York"
      teams={[]}
      role={'Grantee'}
      discoverHref={'/'}
    />,
  );
  expect(getByText('New York')).toBeVisible();
  expect(getByTitle(/location/i)).toBeInTheDocument();
});
it('does not show the location icon if no location is available', () => {
  const { queryByTitle } = render(
    <ProfilePersonalText
      location={undefined}
      teams={[]}
      role={'Grantee'}
      discoverHref={'/'}
    />,
  );
  expect(queryByTitle(/location/i)).toBe(null);
});

it("generates information about the user's team", async () => {
  const { container } = render(
    <ProfilePersonalText
      teams={[
        { id: '42', displayName: 'Team', role: 'Lead PI', href: `/teams/42` },
        {
          id: '1337',
          displayName: 'Meat',
          role: 'Collaborator',
          href: `/teams/1337`,
        },
      ]}
      role={'Grantee'}
      discoverHref={'/'}
    />,
  );
  expect(container).toHaveTextContent(/Lead PI on Team/);
});
it('does not show team information if the user is not on a team', async () => {
  const { container } = render(
    <ProfilePersonalText teams={[]} role={'Grantee'} discoverHref={'/'} />,
  );
  expect(container).not.toHaveTextContent(/\w on \w/);
});
