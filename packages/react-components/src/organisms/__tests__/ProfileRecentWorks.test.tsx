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

it('renders content with a link to external resource', async () => {
  const { getByRole } = render(
    <ProfileRecentWorks
      orcidWorks={[
        {
          doi: 'https://hub.asap.science',
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

  expect(getByRole('link')).toHaveAttribute('href', 'https://hub.asap.science');
});

it('renders date with just the year', async () => {
  const { getByText } = render(
    <ProfileRecentWorks
      orcidWorks={[
        {
          title: 'Title',
          type: 'BOOK' as const,
          publicationDate: {
            year: '2020',
          },
          lastModifiedDate: '1478865224685',
        },
      ]}
    />,
  );

  expect(getByText(/title/i)).toBeVisible();
  expect(getByText(/published/i).textContent).toMatchInlineSnapshot(
    `"Originally Published: 2020"`,
  );
});

it('renders date with month and year', async () => {
  const { getByText } = render(
    <ProfileRecentWorks
      orcidWorks={[
        {
          title: 'Title',
          type: 'BOOK' as const,
          publicationDate: {
            year: '2020',
            month: '05',
          },
          lastModifiedDate: '1478865224685',
        },
      ]}
    />,
  );

  expect(getByText(/title/i)).toBeVisible();
  expect(getByText(/published/i).textContent).toMatchInlineSnapshot(
    `"Originally Published: May 2020"`,
  );
});

it('renders date with day, month and year', async () => {
  const { getByText } = render(
    <ProfileRecentWorks
      orcidWorks={[
        {
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
  expect(getByText(/published/i).textContent).toMatchInlineSnapshot(
    `"Originally Published: 12th May 2020"`,
  );
});
