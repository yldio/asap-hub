import {
  createDiscussionResponse,
  createManuscriptResponse,
  getComplianceReportDataObject,
} from '@asap-hub/fixtures';
import { ManuscriptVersion } from '@asap-hub/model';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React, { ComponentProps } from 'react';
import { Router } from 'react-router-dom';
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

const baseVersion = createManuscriptResponse().versions[0] as ManuscriptVersion;
const props: ComponentProps<typeof ManuscriptVersionCard> = {
  version: baseVersion,
  teamId: 'team-id-0',
  manuscriptId: 'manuscript-1',
  openDiscussionTab: jest.fn(),
};

it('displays quick checks when present', async () => {
  const asapAffiliationIncludedDetails =
    "Including ASAP as an affiliation hasn't been done due to compliance with journal guidelines, needing agreement from authors and institutions, administrative complexities, and balancing recognition with primary affiliations.";

  const author = {
    id: 'author-id',
    displayName: 'Arthur Author',
    firstName: 'Arthur',
    lastName: 'Author',
    alumniSinceDate: undefined,
    avatarUrl: 'http://image',
    teams: [
      {
        id: 'team-author',
        name: 'Team Author',
      },
    ],
  };

  const editor = {
    id: 'editor-id',
    displayName: 'Edith Editor',
    firstName: 'Edith',
    lastName: 'Editor',
    alumniSinceDate: undefined,
    avatarUrl: 'http://image',
    teams: [
      {
        id: 'team-editor',
        name: 'Team Editor',
      },
    ],
  };
  const { getByText, queryByText, getByLabelText, rerender } = render(
    <ManuscriptVersionCard {...props} />,
  );
  userEvent.click(getByLabelText('Expand Version'));

  await waitFor(() => {
    expect(
      queryByText(
        /Included ASAP as an affiliation within the author list for all ASAP-affiliated authors/i,
      ),
    ).not.toBeInTheDocument();
  });

  const updatedVersion = {
    ...baseVersion,
    asapAffiliationIncludedDetails,
    createdBy: author,
    updatedBy: editor,
    createdDate: '2024-06-20T11:06:58.899Z',
    publishedAt: '2024-06-21T11:06:58.899Z',
    otherDetails: 'Necessary info',
  };

  rerender(<ManuscriptVersionCard {...props} version={updatedVersion} />);

  await waitFor(() => {
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
  });
});
it('displays createdBy as fallback for updatedBy when updatedBy is well defined', () => {
  const author = {
    id: 'author-id',
    displayName: 'Arthur Author',
    firstName: 'Arthur',
    lastName: 'Author',
    alumniSinceDate: undefined,
    avatarUrl: 'http://image',
    teams: [
      {
        id: 'team-author',
        name: 'Team Author',
      },
    ],
  };

  const screen = render(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        createdBy: author,
        updatedBy: {
          ...author,
          id: '',
        },
      }}
    />,
  );

  userEvent.click(screen.getByLabelText('Expand Version'));

  expect(screen.getAllByText('Arthur Author').length).toEqual(2);
  expect(
    screen.getAllByText('Arthur Author')[0]!.closest('a')!.href!,
  ).toContain('/network/users/author-id');
  expect(screen.getAllByText('Team Author')[0]!.closest('a')!.href!).toContain(
    '/network/teams/team-author',
  );
});

describe('edit', () => {
  it('does not display the edit button when isManuscriptContributor is false', () => {
    const { queryByLabelText } = render(
      <ManuscriptVersionCard {...props} isManuscriptContributor={false} />,
    );
    expect(queryByLabelText('Edit')).not.toBeInTheDocument();
  });

  it('does not display the edit button when isActiveVersion is false', () => {
    const { queryByLabelText } = render(
      <ManuscriptVersionCard {...props} isActiveVersion={false} />,
    );
    expect(queryByLabelText('Edit')).not.toBeInTheDocument();
  });

  it('navigates to edit form page when clicking on edit button', () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');

    const { getByLabelText } = render(
      <Router history={history}>
        <ManuscriptVersionCard
          {...props}
          isActiveVersion
          isManuscriptContributor
        />
      </Router>,
    );
    userEvent.click(getByLabelText('Edit'));
    expect(pushSpy).toHaveBeenCalledWith(
      '/network/teams/team-id-0/workspace/edit-manuscript/manuscript-1',
    );
  });
});

it('displays Additional Information section when present', () => {
  const { getByRole, queryByRole, rerender, getByLabelText } = render(
    <ManuscriptVersionCard {...props} />,
  );
  userEvent.click(getByLabelText('Expand Version'));
  expect(
    queryByRole('heading', { name: /Additional Information/i }),
  ).not.toBeInTheDocument();

  rerender(
    <ManuscriptVersionCard
      {...props}
      version={{ ...baseVersion, otherDetails: 'Necessary info' }}
    />,
  );

  expect(
    getByRole('heading', { name: /Additional Information/i }),
  ).toBeVisible();
});

it('renders a divider between fields in Additional Information section and files section', () => {
  const { queryAllByRole, getByLabelText } = render(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        preprintDoi: '10.1101/gr.10.12.1841',
        publicationDoi: '10.1101/gr.10.12.1842',
        requestingApcCoverage: 'Already submitted',
        otherDetails: 'Necessary info',
      }}
    />,
  );

  userEvent.click(getByLabelText('Expand Version'));
  expect(queryAllByRole('separator').length).toEqual(6);
});

it.each`
  field                      | title                        | newValue
  ${'preprintDoi'}           | ${'Preprint DOI'}            | ${'10.1101/gr.10.12.1841'}
  ${'publicationDoi'}        | ${'Publication DOI'}         | ${'10.1101/gr.10.12.1841'}
  ${'requestingApcCoverage'} | ${'Requested APC Coverage?'} | ${'Yes'}
  ${'otherDetails'}          | ${'Other details'}           | ${'new details'}
`(`displays field $field when present`, async ({ field, title, newValue }) => {
  const { getByLabelText, getByText, queryByText, rerender } = render(
    <ManuscriptVersionCard {...props} />,
  );
  userEvent.click(getByLabelText('Expand Version'));
  expect(queryByText(title)).not.toBeInTheDocument();

  const updatedVersion = {
    ...baseVersion,
    [field]: newValue,
  };

  rerender(<ManuscriptVersionCard {...props} version={updatedVersion} />);

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

  const { getByText, getByLabelText } = render(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        preprintDoi: preprintDoiValue,
        publicationDoi: publicationDoiValue,
      }}
    />,
  );
  userEvent.click(getByLabelText('Expand Version'));

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
  const { getByText, getByLabelText } = render(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        manuscriptFile: {
          filename: 'manuscript_file.pdf',
          url: 'https://example.com/main-file.pdf',
          id: 'file-1',
        },
        keyResourceTable: undefined,
      }}
    />,
  );
  userEvent.click(getByLabelText('Expand Version'));

  expect(getByText('manuscript_file.pdf')).toBeVisible();
  expect(getByText('Download').closest('a')).toHaveAttribute(
    'href',
    'https://example.com/main-file.pdf',
  );
});

it('renders key resource table file details and download link', () => {
  const { getAllByText, getByText, getByLabelText } = render(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        manuscriptFile: {
          filename: 'manuscript_file.pdf',
          url: 'https://example.com/main-file.pdf',
          id: 'file-1',
        },
        keyResourceTable: {
          filename: 'key_resource_table.csv',
          url: 'https://example.com/key_resource_table.csv',
          id: 'file-2',
        },
      }}
    />,
  );
  userEvent.click(getByLabelText('Expand Version'));

  expect(getByText('key_resource_table.csv')).toBeVisible();
  expect(getAllByText('Download')[1]!.closest('a')).toHaveAttribute(
    'href',
    'https://example.com/key_resource_table.csv',
  );
});

it("does not display Submitter's Name and Submission Date if submitterName and submissionDate are not defined", () => {
  const { getByLabelText, getByText, queryByText } = render(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        requestingApcCoverage: 'No',
        submissionDate: undefined,
        submitterName: undefined,
      }}
    />,
  );
  userEvent.click(getByLabelText('Expand Version'));

  expect(getByText(/Requested APC Coverage/i)).toBeInTheDocument();
  expect(getByText(/No/i)).toBeInTheDocument();

  expect(queryByText(/Submitter's Name/i)).not.toBeInTheDocument();

  expect(queryByText(/Submission Date/i)).not.toBeInTheDocument();
});

it('displays apc coverage information', () => {
  const { getByLabelText, getByText } = render(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        requestingApcCoverage: 'Already submitted',
        submissionDate: new Date('2024-10-03'),
        submitterName: 'Janet Doe',
      }}
    />,
  );
  userEvent.click(getByLabelText('Expand Version'));

  expect(getByText(/Requested APC Coverage/i)).toBeInTheDocument();
  expect(getByText(/Already submitted/i)).toBeInTheDocument();

  expect(getByText(/Submitter's Name/i)).toBeInTheDocument();
  expect(getByText(/Janet Doe/i)).toBeInTheDocument();

  expect(getByText(/Submission Date/i)).toBeInTheDocument();
  expect(getByText(/Thu, 3rd October 2024/i)).toBeInTheDocument();
});

it('renders additional files details and download link when provided', () => {
  const { getAllByText, getByText, getByLabelText } = render(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        manuscriptFile: {
          filename: 'manuscript_file.pdf',
          url: 'https://example.com/main-file.pdf',
          id: 'file-1',
        },
        keyResourceTable: undefined,
        additionalFiles: [
          {
            filename: 'additional_file.pdf',
            url: 'https://example.com/additional-file.pdf',
            id: 'additional-file-1',
          },
        ],
      }}
    />,
  );
  userEvent.click(getByLabelText('Expand Version'));

  expect(getByText('additional_file.pdf')).toBeVisible();
  expect(getAllByText('Download')[1]!.closest('a')).toHaveAttribute(
    'href',
    'https://example.com/additional-file.pdf',
  );
});

it('displays compliance report section when present', () => {
  const { getByLabelText, queryByRole, rerender, getByRole, unmount } = render(
    <ManuscriptVersionCard {...props} />,
  );
  userEvent.click(getByLabelText('Expand Version'));
  expect(
    queryByRole('heading', { name: /Compliance Report/i }),
  ).not.toBeInTheDocument();
  unmount();

  rerender(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        complianceReport: getComplianceReportDataObject(),
      }}
    />,
  );

  expect(getByRole('heading', { name: /Compliance Report/i })).toBeVisible();
});

it('displays manuscript description', () => {
  const shortDescription = 'A nice short description';
  const longDescription = 'A veeery long description.'.repeat(200);

  setScrollHeightMock(100);
  const { getByRole, rerender, getByText, queryByRole, getByLabelText } =
    render(
      <ManuscriptVersionCard
        {...props}
        version={{
          ...baseVersion,
          description: shortDescription,
        }}
      />,
    );
  userEvent.click(getByLabelText('Expand Version'));
  expect(getByText(shortDescription)).toBeInTheDocument();
  expect(queryByRole('button', { name: /show more/i })).not.toBeInTheDocument();

  setScrollHeightMock(300);
  rerender(
    <ManuscriptVersionCard
      {...props}
      version={{
        ...baseVersion,
        description: longDescription,
      }}
    />,
  );

  expect(getByRole('button', { name: /show more/i })).toBeInTheDocument();
});

it('does not display edit button by default', async () => {
  const asapAffiliationIncludedDetails = 'test discussion';
  const commenter = {
    id: 'commenter-id',
    firstName: 'Connor',
    lastName: 'Commenter',
    displayName: 'Connor Commenter',
    teams: [
      {
        id: 'team-commenter',
        name: 'Team Commenter',
      },
    ],
  };

  const asapAffiliationIncludedDiscussion = createDiscussionResponse(
    asapAffiliationIncludedDetails,
  );
  asapAffiliationIncludedDiscussion.message.createdBy = commenter;
  asapAffiliationIncludedDiscussion.message.createdDate =
    '2024-06-21T11:06:58.899Z';

  const getDiscussion = jest.fn();
  getDiscussion.mockReturnValueOnce(asapAffiliationIncludedDiscussion);

  const updatedVersion = {
    ...baseVersion,
    asapAffiliationIncludedDetails: 'test discussion',
  };

  const { getByText, queryByRole, getByLabelText } = render(
    <ManuscriptVersionCard
      {...props}
      version={updatedVersion}
      isActiveVersion={false}
    />,
  );
  userEvent.click(getByLabelText('Expand Version'));

  await waitFor(() => {
    expect(getByText(/test discussion/i)).toBeVisible();
    expect(queryByRole('button', { name: /Reply/i })).not.toBeInTheDocument();
  });
});

it('does not display reply button if isActiveVersion is false', async () => {
  const asapAffiliationIncludedDetails = 'test discussion';
  const commenter = {
    id: 'commenter-id',
    firstName: 'Connor',
    lastName: 'Commenter',
    displayName: 'Connor Commenter',
    teams: [
      {
        id: 'team-commenter',
        name: 'Team Commenter',
      },
    ],
  };

  const asapAffiliationIncludedDiscussion = createDiscussionResponse(
    asapAffiliationIncludedDetails,
  );
  asapAffiliationIncludedDiscussion.message.createdBy = commenter;
  asapAffiliationIncludedDiscussion.message.createdDate =
    '2024-06-21T11:06:58.899Z';

  const getDiscussion = jest.fn();
  getDiscussion.mockReturnValueOnce(asapAffiliationIncludedDiscussion);

  const updatedVersion = {
    ...baseVersion,
    asapAffiliationIncludedDetails: 'test discussion',
  };

  const { getByText, queryByRole, getByLabelText } = render(
    <ManuscriptVersionCard
      {...props}
      version={updatedVersion}
      isActiveVersion={false}
    />,
  );
  userEvent.click(getByLabelText('Expand Version'));

  await waitFor(() => {
    expect(getByText(/test discussion/i)).toBeVisible();
    expect(queryByRole('button', { name: /Reply/i })).not.toBeInTheDocument();
  });
});
