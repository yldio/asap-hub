import { createManuscriptResponse } from '@asap-hub/fixtures';
import { ManuscriptVersion } from '@asap-hub/model';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ComponentProps } from 'react';
import ManuscriptVersionCard from '../ManuscriptVersionCard';

const setScrollHeightMock = (height: number) => {
  const ref = { current: { scrollHeight: height } };

  Object.defineProperty(ref, 'current', {
    set(_current) {
      this.mockedCurrent = _current;
    },
    get() {
      return { scrollHeight: height };
    },
  });
  jest.spyOn(React, 'useRef').mockReturnValue(ref);
};

afterAll(jest.clearAllMocks);

const props: ComponentProps<typeof ManuscriptVersionCard> = {
  ...(createManuscriptResponse().versions[0] as ManuscriptVersion),
};

it('displays quick checks when present', () => {
  const { getByText, queryByText, getByRole, rerender, getAllByText } = render(
    <ManuscriptVersionCard {...props} />,
  );
  userEvent.click(getByRole('button'));

  expect(
    queryByText(
      /Included ASAP as an affiliation within the author list for all ASAP-affiliated authors/i,
    ),
  ).not.toBeInTheDocument();

  const updatedProps = {
    ...props,
    asapAffiliationIncludedDetails:
      "Including ASAP as an affiliation hasn't been done due to compliance with journal guidelines, needing agreement from authors and institutions, administrative complexities, and balancing recognition with primary affiliations.",
    codeDepositedDetails:
      "This hasn't been done due to time constraints, pending review, and ensuring proper documentation.",
    createdBy: {
      id: 'user-1',
      firstName: 'Joe',
      lastName: 'Doe',
      displayName: 'Joe Doe',
      teams: [
        {
          id: 'team-a',
          name: 'Team A',
        },
      ],
    },
    createdDate: '2024-06-20T11:06:58.899Z',
    publishedAt: '2024-06-21T11:06:58.899Z',
  };

  rerender(<ManuscriptVersionCard {...updatedProps} />);

  expect(
    getByText(
      /Included ASAP as an affiliation within the author list for all ASAP-affiliated authors/i,
    ),
  ).toBeVisible();
  expect(
    getByText(
      /Including ASAP as an affiliation hasn't been done due to compliance with journal guidelines, needing agreement from authors and institutions, administrative complexities, and balancing recognition with primary affiliations./i,
    ),
  ).toBeVisible();

  expect(
    getByText(/Deposited all newly generated code and analysis scripts/i),
  ).toBeVisible();
  expect(
    getByText(
      /This hasn't been done due to time constraints, pending review, and ensuring proper documentation./i,
    ),
  ).toBeVisible();

  expect(getAllByText('Joe Doe').length).toEqual(3);
  expect(getAllByText('Team A').length).toEqual(3);
  expect(getAllByText('21st June 2024').length).toEqual(2);
  expect(getAllByText('20th June 2024').length).toEqual(1);

  expect(getAllByText('Joe Doe')[0]!.closest('a')!.href!).toContain(
    '/network/users/user-1',
  );
  expect(getAllByText('Team A')[0]!.closest('a')!.href!).toContain(
    '/network/teams/team-a',
  );
});

it('displays Additional Information section when present', () => {
  const { getByRole, queryByRole, rerender } = render(
    <ManuscriptVersionCard {...props} />,
  );
  userEvent.click(getByRole('button'));
  expect(
    queryByRole('heading', { name: /Additional Information/i }),
  ).not.toBeInTheDocument();

  rerender(
    <ManuscriptVersionCard {...props} otherDetails={'Necessary info'} />,
  );

  expect(
    getByRole('heading', { name: /Additional Information/i }),
  ).toBeVisible();
});

it('renders a divider between fields in Additional Information section and files section', () => {
  const { getByRole, queryAllByRole } = render(
    <ManuscriptVersionCard
      {...props}
      preprintDoi={'10.1101/gr.10.12.1841'}
      publicationDoi={'10.1101/gr.10.12.1842'}
      requestingApcCoverage={'Already submitted'}
      otherDetails={'Necessary info'}
    />,
  );

  userEvent.click(getByRole('button'));
  expect(queryAllByRole('separator').length).toEqual(6);
});

it.each`
  field                      | title                        | newValue
  ${'preprintDoi'}           | ${'Preprint DOI'}            | ${'10.1101/gr.10.12.1841'}
  ${'publicationDoi'}        | ${'Publication DOI'}         | ${'10.1101/gr.10.12.1841'}
  ${'requestingApcCoverage'} | ${'Requested APC Coverage?'} | ${'Yes'}
  ${'otherDetails'}          | ${'Other details'}           | ${'new details'}
`(`displays field $field when present`, async ({ field, title, newValue }) => {
  const { getByRole, getByText, queryByText, rerender } = render(
    <ManuscriptVersionCard {...props} />,
  );
  userEvent.click(getByRole('button'));
  expect(queryByText(title)).not.toBeInTheDocument();

  const updatedProps = {
    ...props,
    [field]: newValue,
  };

  rerender(<ManuscriptVersionCard {...updatedProps} />);

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
    <ManuscriptVersionCard
      {...props}
      preprintDoi={preprintDoiValue}
      publicationDoi={publicationDoiValue}
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

it('renders manuscript main file details and download link', () => {
  const { getByText, getByRole } = render(
    <ManuscriptVersionCard
      {...props}
      manuscriptFile={{
        filename: 'manuscript_file.pdf',
        url: 'https://example.com/main-file.pdf',
        id: 'file-1',
      }}
      keyResourceTable={undefined}
    />,
  );
  userEvent.click(getByRole('button'));

  expect(getByText('manuscript_file.pdf')).toBeVisible();
  expect(getByText('Download').closest('a')).toHaveAttribute(
    'href',
    'https://example.com/main-file.pdf',
  );
});

it('renders key resource table file details and download link', () => {
  const { getAllByText, getByText, getByRole } = render(
    <ManuscriptVersionCard
      {...props}
      manuscriptFile={{
        filename: 'manuscript_file.pdf',
        url: 'https://example.com/main-file.pdf',
        id: 'file-1',
      }}
      keyResourceTable={{
        filename: 'key_resource_table.csv',
        url: 'https://example.com/key_resource_table.csv',
        id: 'file-2',
      }}
    />,
  );
  userEvent.click(getByRole('button'));

  expect(getByText('key_resource_table.csv')).toBeVisible();
  expect(getAllByText('Download')[1]!.closest('a')).toHaveAttribute(
    'href',
    'https://example.com/key_resource_table.csv',
  );
});

it("does not display Submitter's Name and Submission Date if submitterName and submissionDate are not defined", () => {
  const { getByRole, getByText, queryByText } = render(
    <ManuscriptVersionCard
      {...props}
      requestingApcCoverage="No"
      submissionDate={undefined}
      submitterName={undefined}
    />,
  );
  userEvent.click(getByRole('button'));

  expect(getByText(/Requested APC Coverage/i)).toBeInTheDocument();
  expect(getByText(/No/i)).toBeInTheDocument();

  expect(queryByText(/Submitter's Name/i)).not.toBeInTheDocument();

  expect(queryByText(/Submission Date/i)).not.toBeInTheDocument();
});

it('displays apc coverage information', () => {
  const { getByRole, getByText } = render(
    <ManuscriptVersionCard
      {...props}
      requestingApcCoverage="Already submitted"
      submissionDate={new Date('2024-10-03')}
      submitterName="Janet Doe"
    />,
  );
  userEvent.click(getByRole('button'));

  expect(getByText(/Requested APC Coverage/i)).toBeInTheDocument();
  expect(getByText(/Already submitted/i)).toBeInTheDocument();

  expect(getByText(/Submitter's Name/i)).toBeInTheDocument();
  expect(getByText(/Janet Doe/i)).toBeInTheDocument();

  expect(getByText(/Submission Date/i)).toBeInTheDocument();
  expect(getByText(/Thu, 3rd October 2024/i)).toBeInTheDocument();
});

it('renders additional files details and download link when provided', () => {
  const { getAllByText, getByText, getByRole } = render(
    <ManuscriptVersionCard
      {...props}
      manuscriptFile={{
        filename: 'manuscript_file.pdf',
        url: 'https://example.com/main-file.pdf',
        id: 'file-1',
      }}
      keyResourceTable={undefined}
      additionalFiles={[
        {
          filename: 'additional_file.pdf',
          url: 'https://example.com/additional-file.pdf',
          id: 'additional-file-1',
        },
      ]}
    />,
  );
  userEvent.click(getByRole('button'));

  expect(getByText('additional_file.pdf')).toBeVisible();
  expect(getAllByText('Download')[1]!.closest('a')).toHaveAttribute(
    'href',
    'https://example.com/additional-file.pdf',
  );
});

it('displays compliance report section when present', () => {
  const { getByRole, queryByRole, rerender } = render(
    <ManuscriptVersionCard {...props} />,
  );
  userEvent.click(getByRole('button'));
  expect(
    queryByRole('heading', { name: /Compliance Report/i }),
  ).not.toBeInTheDocument();

  rerender(
    <ManuscriptVersionCard
      {...props}
      complianceReport={{
        url: 'http://example.com',
        description: 'compliance report description',
      }}
    />,
  );

  expect(getByRole('heading', { name: /Compliance Report/i })).toBeVisible();
});

it('displays manuscript description', () => {
  const shortDescription = 'A nice short description';
  const longDescription = 'A veeery long description.'.repeat(200);

  setScrollHeightMock(100);
  const { getByRole, rerender, getByText, queryByRole } = render(
    <ManuscriptVersionCard {...props} description={shortDescription} />,
  );
  userEvent.click(getByRole('button'));
  expect(getByText(shortDescription)).toBeInTheDocument();
  expect(queryByRole('button', { name: /show more/i })).not.toBeInTheDocument();

  setScrollHeightMock(300);
  rerender(<ManuscriptVersionCard {...props} description={longDescription} />);

  expect(getByRole('button', { name: /show more/i })).toBeInTheDocument();
});
