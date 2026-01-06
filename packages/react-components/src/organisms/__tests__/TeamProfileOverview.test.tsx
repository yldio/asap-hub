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
});
