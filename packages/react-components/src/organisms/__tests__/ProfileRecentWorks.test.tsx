import React from 'react';
import { render } from '@testing-library/react';
import ProfileRecentWorks from '../ProfileRecentWorks';

it('renders an an header with number of members', () => {
  const { getByRole } = render(<ProfileRecentWorks />);

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Recent Publications (0)"`,
  );
});

it('renders the content', async () => {
  const { getByText } = render(
    <ProfileRecentWorks
      orcidWorks={[
        {
          id: '42',
          title: 'Title',
          type: 'BOOK' as const,
          publicationDate: {
            year: '2020',
            month: '05',
            day: '12',
          },
          lastModifiedDate: '1478865224685',
        },
      ]}
    />,
  );

  expect(getByText(/title/i)).toBeVisible();
  expect(getByText('Publication')).toBeVisible();
});
