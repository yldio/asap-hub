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

it('does not show read proposal if no proposal avaiilable', () => {
  const { rerender, queryByText } = render(
    <TeamOverview
      projectTitle="Title"
      projectSummary="Summary"
      proposalHref="https://localhost/"
    />,
  );
  expect(queryByText('Read Proposal')).toBeDefined();
  rerender(<TeamOverview projectTitle="Title" projectSummary="Summary" />);
  expect(queryByText('Read Proposal')).toBe(null);
});
