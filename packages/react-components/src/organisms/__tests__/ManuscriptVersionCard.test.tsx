import {
  createDiscussionResponse,
  createManuscriptResponse,
  getComplianceReportDataObject,
} from '@asap-hub/fixtures';
import { ManuscriptLifecycle, ManuscriptVersion } from '@asap-hub/model';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import React, { ComponentProps } from 'react';
import { Router } from 'react-router-dom';
import ManuscriptVersionCard, {
  getLifecycleCode,
  getManuscriptVersionUID,
} from '../ManuscriptVersionCard';

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
  grantId: '000123',
  teamIdCode: 'TI1',
  teamId: 'team-id-0',
  manuscriptCount: 1,
  onReplyToDiscussion: jest.fn(),
  getDiscussion: jest.fn(),
  manuscriptId: 'manuscript-1',
  isTeamMember: true,
  canEditManuscript: true,
  isActiveManuscript: true,
  createComplianceDiscussion: jest.fn(),
  useVersionById: jest.fn(),
};

it('displays quick checks when present', () => {
  const asapAffiliationIncludedDetails =
    "Including ASAP as an affiliation hasn't been done due to compliance with journal guidelines, needing agreement from authors and institutions, administrative complexities, and balancing recognition with primary affiliations.";
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
  const { getByText, queryByText, getByLabelText, rerender, getAllByText } =
    render(<ManuscriptVersionCard {...props} getDiscussion={getDiscussion} />);
  userEvent.click(getByLabelText('Expand Version'));

  expect(
    queryByText(
      /Included ASAP as an affiliation within the author list for all ASAP-affiliated authors/i,
    ),
  ).not.toBeInTheDocument();

  const updatedVersion = {
    ...baseVersion,
    asapAffiliationIncludedDetails: asapAffiliationIncludedDiscussion,
    createdBy: author,
    updatedBy: editor,
    createdDate: '2024-06-20T11:06:58.899Z',
    publishedAt: '2024-06-21T11:06:58.899Z',
    otherDetails: 'Necessary info',
  };

  rerender(
    <ManuscriptVersionCard
      {...props}
      version={updatedVersion}
      getDiscussion={getDiscussion}
    />,
  );

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

  expect(getAllByText('Arthur Author').length).toEqual(1);
  expect(getAllByText('Edith Editor').length).toEqual(1);
  expect(getAllByText('Connor Commenter').length).toEqual(1);
  expect(getAllByText('Team Author').length).toEqual(1);
  expect(getAllByText('Team Editor').length).toEqual(1);
  expect(getAllByText('Team Commenter').length).toEqual(1);
  expect(getAllByText('21st June 2024').length).toEqual(2);
  expect(getAllByText('20th June 2024').length).toEqual(1);

  expect(getAllByText('Arthur Author')[0]!.closest('a')!.href!).toContain(
    '/network/users/author-id',
  );
  expect(getAllByText('Team Author')[0]!.closest('a')!.href!).toContain(
    '/network/teams/team-author',
  );

  expect(getAllByText('Connor Commenter')[0]!.closest('a')!.href!).toContain(
    '/network/users/commenter-id',
  );
  expect(getAllByText('Team Commenter')[0]!.closest('a')!.href!).toContain(
    '/network/teams/team-commenter',
  );
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
  it('does not display the edit button when canEditManuscript is false', () => {
    const { queryByLabelText } = render(
      <ManuscriptVersionCard {...props} canEditManuscript={false} />,
    );
    expect(queryByLabelText('Edit')).not.toBeInTheDocument();
  });

  it('does not display the edit button when isActiveManuscript is false', () => {
    const { queryByLabelText } = render(
      <ManuscriptVersionCard {...props} isActiveManuscript={false} />,
    );
    expect(queryByLabelText('Edit')).not.toBeInTheDocument();
  });

  it('navigates to edit form page when clicking on edit button', () => {
    const history = createMemoryHistory();
    const pushSpy = jest.spyOn(history, 'push');

    const { getByLabelText } = render(
      <Router history={history}>
        <ManuscriptVersionCard {...props} />
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

  const getDiscussion = jest
    .fn()
    .mockReturnValueOnce(createDiscussionResponse());

  rerender(
    <ManuscriptVersionCard
      {...props}
      version={{ ...baseVersion, otherDetails: 'Necessary info' }}
      getDiscussion={getDiscussion}
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
  const { getByLabelText, queryByRole, rerender, getByRole } = render(
    <ManuscriptVersionCard {...props} />,
  );
  userEvent.click(getByLabelText('Expand Version'));
  expect(
    queryByRole('heading', { name: /Compliance Report/i }),
  ).not.toBeInTheDocument();

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

it('does not display reply button if isActiveManuscript is false', () => {
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
    asapAffiliationIncludedDetails: asapAffiliationIncludedDiscussion,
  };

  const { getByText, queryByRole, getByLabelText } = render(
    <ManuscriptVersionCard
      {...props}
      version={updatedVersion}
      getDiscussion={getDiscussion}
      isActiveManuscript={false}
    />,
  );
  userEvent.click(getByLabelText('Expand Version'));

  expect(getByText(/test discussion/i)).toBeVisible();
  expect(queryByRole('button', { name: /Reply/i })).not.toBeInTheDocument();
});

describe('getLifecycleCode', () => {
  it('returns all appropriate values', () => {
    const lifecyclePairs: { name: ManuscriptLifecycle; value: string }[] = [
      { name: 'Draft Manuscript (prior to Publication)', value: 'G' },
      { name: 'Preprint', value: 'P' },
      { name: 'Publication', value: 'D' },
      { name: 'Publication with addendum or corrigendum', value: 'C' },
      { name: 'Typeset proof', value: 'T' },
      { name: 'Other', value: 'O' },
    ];
    lifecyclePairs.forEach(({ name, value }) => {
      expect(getLifecycleCode({ lifecycle: name })).toBe(value);
    });
  });
});

describe('getManuscriptversionUID', () => {
  it('outputs a manuscript ID in the required format', () => {
    expect(
      getManuscriptVersionUID({
        version: { type: 'Original Research', lifecycle: 'Preprint' },
        grantId: '000AAA',
        teamIdCode: 'AT1',
        manuscriptVersionCount: 9,
        manuscriptCount: 234,
      }),
    ).toBe('AT1-000AAA-234-org-P-9');

    expect(
      getManuscriptVersionUID({
        version: {
          type: 'Review / Op-Ed / Letter / Hot Topic',
          lifecycle: 'Preprint',
        },
        grantId: '000AAA',
        teamIdCode: 'AT1',
        manuscriptVersionCount: 9,
        manuscriptCount: 234,
      }),
    ).toBe('AT1-000AAA-234-rev-P-9');
  });
  it('pads manuscript count with leading 0s', () => {
    expect(
      getManuscriptVersionUID({
        version: { type: 'Original Research', lifecycle: 'Preprint' },
        grantId: '000AAA',
        teamIdCode: 'AT1',
        manuscriptVersionCount: 9,
        manuscriptCount: 4,
      }),
    ).toBe('AT1-000AAA-004-org-P-9');
  });
});
