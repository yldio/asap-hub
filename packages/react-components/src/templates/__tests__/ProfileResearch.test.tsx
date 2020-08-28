import React from 'react';
import { render } from '@testing-library/react';

import ProfileResearch from '../ProfileResearch';

const commonProps = {
  firstName: 'Phillip',
  teams: [],
  skills: [],
};

it('renders research interests', () => {
  const { getByText } = render(<ProfileResearch {...commonProps} />);
  expect(getByText(/background/i)).toBeVisible();
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
