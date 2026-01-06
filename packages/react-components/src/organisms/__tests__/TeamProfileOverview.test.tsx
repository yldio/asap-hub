import { render } from '@testing-library/react';

import TeamProfileOverview from '../TeamProfileOverview';

it('renders team description', () => {
  const { getByText } = render(
    <TeamProfileOverview teamDescription="Description" tags={[]} />,
  );

  expect(getByText('Team Description')).toBeDefined();
  expect(getByText('Description')).toBeDefined();
});

it('renders tags when available', () => {
  const { getByText } = render(
    <TeamProfileOverview
      teamDescription="Description"
      tags={[{ id: '1', name: 'Tag 1' }]}
    />,
  );

  expect(getByText('Tag 1')).toBeDefined();
});

it('does not render tags when empty', () => {
  const { queryByText } = render(
    <TeamProfileOverview teamDescription="Description" tags={[]} />,
  );

  expect(queryByText('Tags')).toBeNull();
  expect(
    getByRole('button', { name: /Supplement Grant/i }),
  ).toBeInTheDocument();

  expect(getByText(supplementGrant.title)).toBeInTheDocument();
  expect(getByText(supplementGrant.description)).toBeInTheDocument();
  expect(
    getByRole('link', { name: /read full proposal/i }),
  ).toBeInTheDocument();
});

it('renders original grant when user clicks on original grant tab', async () => {
  const { queryByText, getByRole, getByText } = render(
    <TeamProfileOverview
      projectTitle="Original Title"
      projectSummary="Original Summary"
      supplementGrant={supplementGrant}
    />,
  );

  await userEvent.click(getByRole('button', { name: /Original Grant/i }));

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
