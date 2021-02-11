import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { disable } from '@asap-hub/flags';

import UserProfileResearch from '../UserProfileResearch';

const commonProps: ComponentProps<typeof UserProfileResearch> = {
  firstName: 'Phillip',
  displayName: 'Phillip Winter',
  email: 'test@example.com',
  teams: [],
  skills: [],
  questions: [],
};

it('renders the role on ASAP', () => {
  const { getByText } = render(
    <UserProfileResearch
      {...commonProps}
      teams={[
        {
          id: '42',
          displayName: 'Team',
          role: 'Lead PI (Core Leadership)',
          href: '/network/teams/42',
        },
      ]}
    />,
  );
  expect(getByText(/role.+asap/i)).toBeVisible();
});

it('renders the skills list', () => {
  const { getByText } = render(
    <UserProfileResearch {...commonProps} skills={['Neurological Diseases']} />,
  );
  expect(getByText(/expertise/i)).toBeVisible();
  expect(getByText('Neurological Diseases')).toBeVisible();
});
it('does not render an empty skills list', () => {
  const { queryByText } = render(
    <UserProfileResearch {...commonProps} skills={[]} />,
  );
  expect(queryByText(/expertise/i)).not.toBeInTheDocument();
  expect(queryByText('Neurological Diseases')).not.toBeInTheDocument();
});

it('renders the questions list', () => {
  const { getByText } = render(
    <UserProfileResearch
      {...commonProps}
      questions={['What is the meaning of life?']}
    />,
  );
  expect(getByText(/open questions/i).tagName).toBe('H2');
  expect(
    getByText('What is the meaning of life?', { exact: false }),
  ).toBeVisible();
});
it('does not render an empty questions list', () => {
  const { queryByText } = render(
    <UserProfileResearch {...commonProps} questions={[]} />,
  );
  expect(queryByText(/open questions/i)).not.toBeInTheDocument();
});

it('does not render an edit button by default', () => {
  const { queryByLabelText } = render(<UserProfileResearch {...commonProps} />);
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});
it('renders an edit button for the role on the team', () => {
  const { getByLabelText } = render(
    <UserProfileResearch
      {...commonProps}
      teams={[
        {
          id: '42',
          displayName: 'Team',
          role: 'Lead PI (Core Leadership)',
          href: '/network/teams/42',
          editHref: '/edit-team-membership/42',
        },
      ]}
    />,
  );
  expect(getByLabelText(/edit.+role.+team/i)).toHaveAttribute(
    'href',
    '/edit-team-membership/42',
  );
});
it('renders an edit button for the skills list', () => {
  const { getByLabelText } = render(
    <UserProfileResearch {...commonProps} editSkillsHref="/edit-skills" />,
  );
  expect(getByLabelText(/edit.+expertise/i)).toHaveAttribute(
    'href',
    '/edit-skills',
  );
});
it('disables the edit button for the skills list (REGRESSION)', () => {
  disable('USER_PROFILE_EDIT_SKILLS');
  const { getByLabelText } = render(
    <UserProfileResearch {...commonProps} editSkillsHref="/edit-skills" />,
  );
  expect(getByLabelText(/edit.+expertise/i)).not.toHaveAttribute('href');
});
it('renders an edit button for the questions list', () => {
  const { getByLabelText } = render(
    <UserProfileResearch
      {...commonProps}
      editQuestionsHref="/edit-questions"
    />,
  );
  expect(getByLabelText(/edit.+question/i)).toHaveAttribute(
    'href',
    '/edit-questions',
  );
});

it('create mailto for email when contactEmail not present', () => {
  const { getByText } = render(
    <UserProfileResearch {...commonProps} email="email@example.com" />,
  );
  expect(getByText(/contact/i).closest('a')).toHaveAttribute(
    'href',
    'mailto:email@example.com',
  );
});

it('create mailto for contactEmail', () => {
  const { getByText } = render(
    <UserProfileResearch
      {...commonProps}
      email="email@example.com"
      contactEmail="contactEmail@example.com"
    />,
  );
  expect(getByText(/contact/i).closest('a')).toHaveAttribute(
    'href',
    'mailto:contactEmail@example.com',
  );
});

it('renders user profile groups card', () => {
  const { getByText } = render(
    <UserProfileResearch
      {...commonProps}
      userProfileGroupsCard={'UserProfileGroups'}
    />,
  );
  expect(getByText(/userprofilegroups/i)).toBeVisible();
});
