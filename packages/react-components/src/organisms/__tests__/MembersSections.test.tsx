import React from 'react';
import { render } from '@testing-library/react';
import MembersSection from '../MembersSection';

it('renders an an header with number of members', () => {
  const { getByText } = render(<MembersSection members={[]} />);
  expect(getByText(/members/i)).toBeVisible();
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
  const heading = getByText(/members/i);

  expect(heading).toBeVisible();
  expect(heading.textContent).toMatchInlineSnapshot(`"Team Members (1)"`);
});
