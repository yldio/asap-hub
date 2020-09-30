import React from 'react';
import { render } from '@testing-library/react';

import ProfileResearch from '../ProfileResearch';

const commonProps = {
  firstName: 'Phillip',
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
  expect(getByText(/open questions/i)).toBeVisible();
  expect(getByText('Q: What is the meaning of life?')).toBeVisible();
});

it('does not render an empty questions list', () => {
  const { queryByText } = render(
    <ProfileResearch {...commonProps} skills={[]} />,
  );
  expect(queryByText('Open Questions')).not.toBeInTheDocument();
});
