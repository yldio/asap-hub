import React from 'react';
import { render } from '@testing-library/react';
import { subYears, formatISO } from 'date-fns';

import ProfileHeader from '../ProfileHeader';

const boilerplateProps = {
  displayName: 'John Doe',
  teams: [],

  aboutHref: './about',
  researchInterestsHref: './research-interests',
  outputsHref: './outputs',
};

it('renders the name as the top-level heading', () => {
  const { getByRole } = render(
    <ProfileHeader {...boilerplateProps} displayName="John Doe" />,
  );
  expect(getByRole('heading')).toHaveTextContent('John Doe');
  expect(getByRole('heading').tagName).toBe('H1');
});

it.each`
  jobTitle     | institution  | department   | text
  ${undefined} | ${'Inst'}    | ${'Dep'}     | ${/Inst, Dep/}
  ${'Job'}     | ${undefined} | ${'Dep'}     | ${/Job/}
  ${'Job'}     | ${'Inst'}    | ${undefined} | ${/Job at Inst/}
  ${'Job'}     | ${'Inst'}    | ${'Dep'}     | ${/Job at Inst, Dep/}
`('generates the position description "$text"', ({ text, ...position }) => {
  const { container } = render(
    <ProfileHeader {...boilerplateProps} {...position} />,
  );
  expect(container).toHaveTextContent(text);
});

it("generates information about the user's first team", async () => {
  const { container } = render(
    <ProfileHeader
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
    <ProfileHeader {...boilerplateProps} teams={[]} />,
  );
  expect(container).not.toHaveTextContent(/\w on \w/);
});

it('generates the last updated text', () => {
  const { container } = render(
    <ProfileHeader
      {...boilerplateProps}
      orcidLastModifiedDate={formatISO(subYears(new Date(), 2))}
    />,
  );
  expect(container).toHaveTextContent(/update.* 2 years ago/);
});
