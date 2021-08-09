import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import UserProfileResearch from '../UserProfileResearch';

const commonProps: ComponentProps<typeof UserProfileResearch> = {
  firstName: 'Phillip',
  displayName: 'Phillip Winter',
  email: 'test@example.com',
  teams: [],
  skills: [],
  questions: [],
  labs: [],
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
          labs: [],
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
  expect(getByText(/expertise/i, { selector: 'h2' })).toBeVisible();
  expect(getByText('Neurological Diseases')).toBeVisible();
});
it('renders opens questions when questions provided', () => {
  const { getByText } = render(
    <UserProfileResearch
      {...commonProps}
      questions={['What is the meaning of life?']}
    />,
  );
  expect(getByText(/open questions/i)).toBeVisible();
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
          editHref: '/edit-team-membership/42',
          labs: [],
        },
      ]}
    />,
  );
  expect(getByLabelText(/edit.+role.+team/i)).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
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

it('doesnt render contact card if isOwnProfile is true', async () => {
  const { queryByText } = render(
    <UserProfileResearch
      {...commonProps}
      email="email@example.com"
      contactEmail="contactEmail@example.com"
      isOwnProfile={true}
    />,
  );
  expect(queryByText(/contact/i)).not.toBeInTheDocument();
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
