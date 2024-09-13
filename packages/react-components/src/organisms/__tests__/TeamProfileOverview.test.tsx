import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TeamProfileOverview from '../TeamProfileOverview';

const supplementGrant = {
  title: 'Supplement Grant Title',
  description: 'Supplement Grant Description',
  proposalURL: 'url',
};

it('renders project title and project summary', () => {
  const { getByText } = render(
    <TeamProfileOverview projectTitle="Title" projectSummary="Summary" />,
  );

  expect(getByText('Title')).toBeDefined();
  expect(getByText('Summary')).toBeDefined();
});

it('renders supplement grant tab only if it team has a supplementGrant', () => {
  const { queryByRole, getByRole, rerender } = render(
    <TeamProfileOverview
      projectTitle="Title"
      projectSummary="Summary"
      supplementGrant={supplementGrant}
    />,
  );

  expect(
    getByRole('button', { name: /Supplement Grant/i }),
  ).toBeInTheDocument();

  rerender(
    <TeamProfileOverview
      projectTitle="Title"
      projectSummary="Summary"
      supplementGrant={undefined}
    />,
  );

  expect(
    queryByRole('button', { name: /Supplement Grant/i }),
  ).not.toBeInTheDocument();
});

it('renders supplement grant title, description and read full proposal button', () => {
  const { getByRole, getByText } = render(
    <TeamProfileOverview
      projectTitle="Title"
      projectSummary="Summary"
      supplementGrant={supplementGrant}
    />,
  );

  expect(
    getByRole('button', { name: /Supplement Grant/i }),
  ).toBeInTheDocument();

  expect(getByText(supplementGrant.title)).toBeInTheDocument();
  expect(getByText(supplementGrant.description)).toBeInTheDocument();
  expect(
    getByRole('link', { name: /read full proposal/i }),
  ).toBeInTheDocument();
});

it('renders original grant when user clicks on original grant tab', () => {
  const { queryByText, getByRole, getByText } = render(
    <TeamProfileOverview
      projectTitle="Original Title"
      projectSummary="Original Summary"
      supplementGrant={supplementGrant}
    />,
  );

  userEvent.click(getByRole('button', { name: /Original Grant/i }));

  expect(getByText('Original Title')).toBeInTheDocument();
  expect(getByText('Original Summary')).toBeInTheDocument();

  expect(queryByText(supplementGrant.title)).not.toBeInTheDocument();
  expect(queryByText(supplementGrant.description)).not.toBeInTheDocument();
});

it('does not show read proposal if no proposal available', () => {
  const { rerender, queryByText } = render(
    <TeamProfileOverview
      projectTitle="Title"
      projectSummary="Summary"
      proposalURL="42"
    />,
  );
  expect(queryByText('Read Proposal')).toBeDefined();
  rerender(
    <TeamProfileOverview projectTitle="Title" projectSummary="Summary" />,
  );
  expect(queryByText('Read Proposal')).toBe(null);
});
