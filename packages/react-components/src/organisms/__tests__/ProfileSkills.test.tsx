import React from 'react';
import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import ProfileSkills from '../ProfileSkills';

it('renders skills and expertise', () => {
  const { getByText, getByRole } = render(
    <ProfileSkills skills={['a', 'b', 'c']} />,
  );
  expect(getByText('a')).toBeVisible();
  expect(getByText('b')).toBeVisible();
  expect(getByText('c')).toBeVisible();
  expect(getByRole('heading', { level: 2 }).textContent).toEqual(
    'Expertise and Resources',
  );
});

it('renders skills and expertises with description', () => {
  const { getByText, getByRole } = render(
    <ProfileSkills
      skillsDescription={'description'}
      skills={['a', 'b', 'c']}
    />,
  );

  expect(getByText('a')).toBeVisible();
  expect(getByText('b')).toBeVisible();
  expect(getByText('c')).toBeVisible();
  expect(getByText('description')).toBeVisible();
  expect(getByRole('heading').textContent).toEqual('Expertise and Resources');
});

it('renders description placeholder component when no description and own profile', () => {
  const { getByText, queryByText, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <ProfileSkills skillsDescription="" skills={['test']} />,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/you summarize/i)).toBeNull();

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <ProfileSkills skillsDescription="" skills={['test']} />,
    </UserProfileContext.Provider>,
  );

  expect(getByText(/you summarize/i)).toBeVisible();
});

it('renders tags placeholder component when description, no tags and own profile', () => {
  const { getByText, queryByText, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <ProfileSkills skillsDescription="test" skills={[]} />,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/add tags/i)).toBeNull();

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <ProfileSkills skillsDescription="test" skills={[]} />,
    </UserProfileContext.Provider>,
  );
  expect(getByText(/add tags/i)).toBeVisible();
});

it('is not rendered when not own profile and without skills', () => {
  const { container } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <ProfileSkills skillsDescription="" skills={[]} />
    </UserProfileContext.Provider>,
  );

  expect(container).toBeEmptyDOMElement();
});
