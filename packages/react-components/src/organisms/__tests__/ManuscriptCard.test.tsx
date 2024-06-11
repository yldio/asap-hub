import { createManuscriptResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import ManuscriptCard from '../ManuscriptCard';

const props: ComponentProps<typeof ManuscriptCard> = {
  ...createManuscriptResponse(),
};
it('displays Additional Information section when present', () => {
  const { getByRole, queryByRole, rerender } = render(
    <ManuscriptCard {...props} />,
  );
  userEvent.click(getByRole('button'));
  expect(
    queryByRole('heading', { name: /Additional Information/i }),
  ).not.toBeInTheDocument();

  rerender(
    <ManuscriptCard
      {...props}
      versions={[{ ...props.versions[0]!, otherDetails: 'Necessary info' }]}
    />,
  );

  expect(
    getByRole('heading', { name: /Additional Information/i }),
  ).toBeVisible();
});

it('renders a divider between fields in Additional Information section', () => {
  const { getByRole, queryAllByRole } = render(
    <ManuscriptCard
      {...props}
      versions={[
        {
          ...props.versions[0]!,
          preprintDoi: '10.1101/gr.10.12.1841',
          publicationDoi: '10.1101/gr.10.12.1842',
          requestingApcCoverage: 'Already submitted',
          otherDetails: 'Necessary info',
        },
      ]}
    />,
  );

  userEvent.click(getByRole('button'));
  expect(queryAllByRole('separator').length).toEqual(4);
});

it.each`
  field                      | title                         | newValue
  ${'preprintDoi'}           | ${'Preprint DOI'}             | ${'10.1101/gr.10.12.1841'}
  ${'publicationDoi'}        | ${'Publication DOI'}          | ${'10.1101/gr.10.12.1841'}
  ${'requestingApcCoverage'} | ${'Requesting APC Coverage?'} | ${'Yes'}
  ${'otherDetails'}          | ${'Other details'}            | ${'new details'}
`(`displays field $field when present`, async ({ field, title, newValue }) => {
  const { getByRole, getByText, queryByText, rerender } = render(
    <ManuscriptCard {...props} />,
  );
  userEvent.click(getByRole('button'));
  expect(queryByText(title)).not.toBeInTheDocument();

  rerender(
    <ManuscriptCard
      {...props}
      versions={[{ ...props.versions[0]!, [field]: newValue }]}
    />,
  );

  expect(getByText(title)).toBeVisible();
  expect(getByText(newValue)).toBeVisible();
});

it('builds the correct href for doi fields', () => {
  const preprintDoiValue = '10.1101/gr.10.12.1841';
  const publicationDoiValue = '10.1101/gr.10.12.1842';
  const expectedPreprintLink = new URL(
    `https://doi.org/${preprintDoiValue}`,
  ).toString();
  const expectedPublicationLink = new URL(
    `https://doi.org/${publicationDoiValue}`,
  ).toString();

  const { getByText, getByRole } = render(
    <ManuscriptCard
      {...props}
      versions={[
        {
          ...props.versions[0]!,
          preprintDoi: preprintDoiValue,
          publicationDoi: publicationDoiValue,
        },
      ]}
    />,
  );
  userEvent.click(getByRole('button'));

  expect(getByText(preprintDoiValue)?.closest('a')).toHaveAttribute(
    'href',
    expectedPreprintLink,
  );
  expect(getByText(publicationDoiValue)?.closest('a')).toHaveAttribute(
    'href',
    expectedPublicationLink,
  );
});
