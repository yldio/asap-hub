import React from 'react';
import { render } from '@testing-library/react';

import ProfileSkills from '../ProfileSkills';

it('renders skills and expertise', () => {
  const { getByText, getByRole } = render(
    <ProfileSkills skills={['a', 'b', 'c']} />,
  );
  expect(getByText('a')).toBeVisible();
  expect(getByText('b')).toBeVisible();
  expect(getByText('c')).toBeVisible();
  expect(getByRole('heading').textContent).toEqual('Expertise and Resources');
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
