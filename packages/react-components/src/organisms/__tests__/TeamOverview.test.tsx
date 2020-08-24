import React from 'react';
import { render } from '@testing-library/react';

import TeamOverview from '../TeamOverview';

it('renders project title and project summary', () => {
  const { getByText } = render(
    <TeamOverview projectTitle="Title" projectSummary="Summary" />,
  );

  expect(getByText('Title')).toBeDefined();
  expect(getByText('Summary')).toBeDefined();
});
