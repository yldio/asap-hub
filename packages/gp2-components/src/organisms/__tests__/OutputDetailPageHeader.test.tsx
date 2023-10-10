import { render } from '@testing-library/react';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

import OutputDetailPageHeader from '../OutputDetailPageHeader';

it('renders an output with an external link if available', () => {
  const { queryByTitle, getByTitle, getByText, rerender } = render(
    <OutputDetailPageHeader
      {...gp2Fixtures.createOutputResponse()}
      link={undefined}
    />,
  );
  expect(queryByTitle(/external link/i)).not.toBeInTheDocument();
  rerender(
    <OutputDetailPageHeader
      {...gp2Fixtures.createOutputResponse()}
      link="http://example.com"
    />,
  );
  expect(getByTitle(/external link/i).closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
  expect(getByText('Access Output')).toBeInTheDocument();
});

it('renders an output with the last updated date', () => {
  const { getByText } = render(
    <OutputDetailPageHeader
      {...gp2Fixtures.createOutputResponse()}
      // month index starts with 0, so month 1 is Feb
      lastUpdatedPartial={new Date(2003, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/1st February 2003/)).toBeVisible();
});

it('falls back to created date when added date omitted', () => {
  const { getByText, rerender } = render(
    <OutputDetailPageHeader
      {...gp2Fixtures.createOutputResponse()}
      created={new Date(2011, 1, 1, 1).toISOString()}
      addedDate={new Date(2012, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/1st February 2012/)).toBeVisible();
  rerender(
    <OutputDetailPageHeader
      {...gp2Fixtures.createOutputResponse()}
      created={new Date(2011, 1, 1, 1).toISOString()}
      addedDate={new Date(2011, 1, 1, 1).toISOString()}
    />,
  );
  expect(getByText(/1st February 2011/)).toBeVisible();
});

it('shows authors', () => {
  const { getByText } = render(
    <OutputDetailPageHeader
      {...gp2Fixtures.createOutputResponse()}
      authors={[
        {
          ...gp2Fixtures.createUserResponse(),
          displayName: 'John Doe',
          id: 'john-id',
        },
      ]}
    />,
  );
  expect(getByText('John Doe')).toBeVisible();
  expect(getByText('John Doe').closest('a')).toHaveAttribute(
    'href',
    '/users/john-id',
  );
});

it('renders an output with source (project/working group), document type, type, subtype and source name', () => {
  const { getAllByRole, getByText, rerender } = render(
    <OutputDetailPageHeader
      {...gp2Fixtures.createOutputResponse()}
      authors={[]}
      documentType="Code/Software"
      projects={[]}
      workingGroups={[
        {
          id: 'wg-id',
          title: 'Steering Committee',
        },
      ]}
      type={undefined}
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Working Group', 'Code/Software']);
  expect(getByText('Steering Committee')).toBeVisible();
  expect(getByText('Steering Committee').closest('a')).toHaveAttribute(
    'href',
    '/working-groups/wg-id',
  );

  rerender(
    <OutputDetailPageHeader
      {...gp2Fixtures.createOutputResponse()}
      authors={[]}
      documentType="Article"
      projects={[
        {
          id: 'project-id',
          title:
            'Polygenic Risk Score Project of PD risk in non-European populations',
        },
      ]}
      workingGroups={[]}
      type="Blog"
      subtype="Preprints"
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Project', 'Article', 'Blog', 'Preprints']);
  expect(
    getByText(
      'Polygenic Risk Score Project of PD risk in non-European populations',
    ),
  ).toBeVisible();
  expect(
    getByText(
      'Polygenic Risk Score Project of PD risk in non-European populations',
    ).closest('a'),
  ).toHaveAttribute('href', '/projects/project-id');
});
