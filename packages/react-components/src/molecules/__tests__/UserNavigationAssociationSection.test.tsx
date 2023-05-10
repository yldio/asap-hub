import { render } from '@testing-library/react';

import UserNavigationAssociationSection from '../UserNavigationAssociationSection';

const interestGroup = {
  id: '1',
  name: 'Interest Group 1',
  href: '/interest-group-1',
  active: true,
};
const workingGroup = {
  id: '1',
  name: 'Working Group 1',
  href: '/working-group-1',
  active: true,
};
const team = {
  id: '1',
  name: 'Team 1',
  href: '/team-1',
};

it('renders a association section with all the details', () => {
  const { getByText, getByRole } = render(
    <UserNavigationAssociationSection
      association={[{ ...interestGroup, name: 'group 1' }]}
      userOnboarded={true}
      title="MY INTEREST GROUPS"
    />,
  );

  expect(getByText('group 1')).toBeVisible();
  expect(getByText('MY INTEREST GROUPS')).toBeVisible();
  expect(getByRole('link', { name: /interest group/i })).toHaveAttribute(
    'href',
    expect.stringMatching(interestGroup.href),
  );
});

it('renders an association section with all the details', () => {
  const { getByText, getByRole } = render(
    <UserNavigationAssociationSection
      association={[{ ...interestGroup, name: 'group 1', href: '/abc' }]}
      userOnboarded={true}
      title="MY INTEREST GROUPS"
    />,
  );

  expect(getByText('group 1')).toBeVisible();
  expect(getByText('MY INTEREST GROUPS')).toBeVisible();
  expect(getByRole('link', { name: /interest group/i })).toHaveAttribute(
    'href',
    expect.stringMatching('/abc'),
  );
});

it('disables the navigation link based on active and user onboarded', () => {
  const { getByRole, rerender, getByText } = render(
    <UserNavigationAssociationSection
      association={[
        { ...interestGroup, name: 'group 1', href: '/abc', active: false },
      ]}
      userOnboarded={true}
      title="MY INTEREST GROUPS"
    />,
  );
  expect(getByText('group 1')).toBeVisible();
  expect(getByRole('link', { name: /interest group/i })).toHaveStyleRule(
    'pointer-events',
    expect.stringMatching('none'),
  );

  rerender(
    <UserNavigationAssociationSection
      association={[
        { ...interestGroup, name: 'group 1', href: '/abc', active: true },
      ]}
      userOnboarded={false}
      title="MY INTEREST GROUPS"
    />,
  );
  expect(getByText('group 1')).toBeVisible();
  expect(getByRole('link', { name: /interest group/i })).toHaveStyleRule(
    'pointer-events',
    expect.stringMatching('none'),
  );
});

it('renders a association section with the correct icon', () => {
  const { getByTitle, rerender } = render(
    <UserNavigationAssociationSection
      association={[workingGroup]}
      userOnboarded={true}
      title="MY WORKING GROUPS"
    />,
  );
  expect(getByTitle('Working Groups')).toBeInTheDocument();

  rerender(
    <UserNavigationAssociationSection
      association={[team]}
      userOnboarded={true}
      title="MY TEAMS"
    />,
  );
  expect(getByTitle('Team')).toBeInTheDocument();

  rerender(
    <UserNavigationAssociationSection
      association={[team]}
      userOnboarded={true}
      title="MY INTEREST GROUPS"
    />,
  );
  expect(getByTitle('Interest Group')).toBeInTheDocument();
});
