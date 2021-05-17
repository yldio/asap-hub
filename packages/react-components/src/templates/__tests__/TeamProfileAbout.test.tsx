import React from 'react';
import { render } from '@testing-library/react';

import TeamProfileAbout from '../TeamProfileAbout';

it('renders the overview', () => {
  const { getByText } = render(
    <TeamProfileAbout projectTitle="Title" skills={[]} members={[]} />,
  );

  expect(getByText(/overview/i)).toBeVisible();
  expect(getByText('Title')).toBeVisible();
});

it('renders the contact banner', () => {
  const { getByRole } = render(
    <TeamProfileAbout
      projectTitle="Title"
      pointOfContact={{
        id: 'uuid',
        displayName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        role: 'Project Manager',
      }}
      skills={[]}
      members={[]}
    />,
  );

  const link = getByRole('link');
  expect(link).toBeVisible();
  expect(link).toHaveAttribute('href', 'mailto:test@test.com');
});

it('renders the team list', () => {
  const { getByText } = render(
    <TeamProfileAbout
      projectTitle="Title"
      skills={[]}
      members={[
        {
          id: 'uuid',
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          role: 'Project Manager',
        },
      ]}
    />,
  );

  const avatar = getByText(/john doe/i);
  expect(avatar).toBeVisible();
  expect(avatar.closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/uuid/i),
  );
});

it('renders the skill list', () => {
  const { getByText } = render(
    <TeamProfileAbout
      projectTitle="Title"
      skills={['example skill']}
      members={[]}
    />,
  );
  expect(getByText(/example skill/i)).toBeVisible();
  expect(getByText(/expertise and resources/i)).toBeVisible();
});
