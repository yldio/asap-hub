import { render } from '@testing-library/react';
import TeamProfileTags from '../TeamProfileTags';

it('renders the tags list', () => {
  const { getByText, getByRole } = render(
    <TeamProfileTags
      tags={[
        { name: 'Tag 1', id: '1' },
        { name: 'Tag 2', id: '2' },
      ]}
    />,
  );

  expect(getByText('Tags')).toBeVisible();
  expect(
    getByText(
      'Explore keywords related to skills, techniques, resources, and tools.',
    ),
  ).toBeVisible();
  expect(getByText('Tag 1')).toBeVisible();
  expect(getByText('Tag 2')).toBeVisible();
  expect(getByRole('separator')).toBeVisible();
});
