import React from 'react';
import { render } from '@testing-library/react';

import TeamProfileOverview from '../TeamProfileOverview';

it('renders project title and project summary', () => {
  const { getByText } = render(
    <TeamProfileOverview projectTitle="Title" projectSummary="Summary" />,
  );

  expect(getByText('Title')).toBeDefined();
  expect(getByText('Summary')).toBeDefined();
});

it('does not show read proposal if no proposal avaiilable', () => {
  const { rerender, queryByText } = render(
    <TeamProfileOverview
      projectTitle="Title"
      projectSummary="Summary"
      proposalHref="https://localhost/"
    />,
  );
  expect(queryByText('Read Proposal')).toBeDefined();
  rerender(
    <TeamProfileOverview projectTitle="Title" projectSummary="Summary" />,
  );
  expect(queryByText('Read Proposal')).toBe(null);
});
