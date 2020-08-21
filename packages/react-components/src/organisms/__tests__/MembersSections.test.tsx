import React from 'react';
import { render } from '@testing-library/react';
import MembersSection from '../MembersSection';

it('renders an header with number of members', () => {
  const { getByRole } = render(<MembersSection members={[]} />);
  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Team Members (0)"`,
  );
});

it('renders the content', async () => {
  const { getByText } = render(
    <MembersSection
      members={[
        {
          id: '42',
          firstName: 'Phillip',
          lastName: 'Mars',
          displayName: 'Phillip Mars, PhD',
          role: 'Collaborator',
        },
      ]}
    />,
  );
  expect(getByText('Phillip Mars, PhD')).toBeVisible();
  expect(getByText('Collaborator')).toBeVisible();
});
