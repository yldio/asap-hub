import React from 'react';
import { render } from '@testing-library/react';
import ProfilePersonalText from '../ProfilePersonalText';

const boilerplateProps = {
  displayName: 'John Doe',
  teams: [],
  teamProfileHref: 'wrong',
};

it.each`
  jobTitle     | institution  | department   | text
  ${undefined} | ${'Inst'}    | ${'Dep'}     | ${/Inst, Dep/}
  ${'Job'}     | ${undefined} | ${'Dep'}     | ${/Job/}
  ${'Job'}     | ${'Inst'}    | ${undefined} | ${/Job at Inst/}
  ${'Job'}     | ${'Inst'}    | ${'Dep'}     | ${/Job at Inst, Dep/}
`('generates the position description "$text"', ({ text, ...position }) => {
  const { container } = render(
    <ProfilePersonalText {...boilerplateProps} {...position} />,
  );
  expect(container).toHaveTextContent(text);
});

it('shows the location', async () => {
  const { getByText, getByTitle } = render(
    <ProfilePersonalText {...boilerplateProps} location="New York" />,
  );
  expect(getByText('New York')).toBeVisible();
  expect(getByTitle(/location/i)).toBeInTheDocument();
});
it('does not show the location icon if no location is available', () => {
  const { queryByTitle } = render(
    <ProfilePersonalText {...boilerplateProps} location={undefined} />,
  );
  expect(queryByTitle(/location/i)).toBe(null);
});

it("generates information about the user's first team", async () => {
  const { container } = render(
    <ProfilePersonalText
      {...boilerplateProps}
      teams={[
        { id: '42', displayName: 'Team', role: 'Role' },
        { id: '1337', displayName: 'Meat', role: 'Lore' },
      ]}
    />,
  );
  expect(container).toHaveTextContent(/Role on Team/);
});
it('does not show team information if the user is not on a team', async () => {
  const { container } = render(
    <ProfilePersonalText {...boilerplateProps} teams={[]} />,
  );
  expect(container).not.toHaveTextContent(/\w on \w/);
});
