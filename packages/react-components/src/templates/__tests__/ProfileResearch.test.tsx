import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ProfileResearch from '../ProfileResearch';

const commonProps: ComponentProps<typeof ProfileResearch> = {
  firstName: 'Phillip',
  displayName: 'Phillip Winter',
  email: 'test@test.com',
  teams: [],
  skills: [],
  questions: [],
};

it('renders research', () => {
  const { getByText } = render(
    <ProfileResearch
      {...commonProps}
      teams={[
        {
          id: '42',
          displayName: 'Team',
          role: 'Role',
        },
      ]}
    />,
  );
  expect(getByText(/research/i)).toBeVisible();
});

it('renders the skills', () => {
  const { getByText } = render(
    <ProfileResearch {...commonProps} skills={['Neurological Diseases']} />,
  );
  expect(getByText('Expertise and Resources')).toBeVisible();
  expect(getByText('Neurological Diseases')).toBeVisible();
});

it('does not render an empty skills list', () => {
  const { queryByText } = render(
    <ProfileResearch {...commonProps} skills={[]} />,
  );
  expect(queryByText('Expertise and Resources')).not.toBeInTheDocument();
  expect(queryByText('Neurological Diseases')).not.toBeInTheDocument();
});

it('renders the questions list', () => {
  const { getByText } = render(
    <ProfileResearch
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
    <ProfileResearch {...commonProps} questions={[]} />,
  );
  expect(queryByText(/open questions/i)).not.toBeInTheDocument();
});
