import {
  createManuscriptResponse,
  createUserResponse,
  manuscriptAuthor,
} from '@asap-hub/fixtures';
import { ManuscriptVersion, UserTeam } from '@asap-hub/model';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { ComponentProps } from 'react';
import { Route, Router } from 'react-router-dom';
import ManuscriptCard, {
  isManuscriptAuthor,
  isManuscriptLead,
} from '../ManuscriptCard';

const useManuscriptById = jest.fn().mockImplementation(() => {
  const manuscript = {
    id: 'manuscript_0',
    title: 'Mock Manuscript Title',
    status: 'Waiting for Report',
    versions: [],
  };

  const setManuscript = jest.fn((newData) => {
    Object.assign(manuscript, newData);
  });

  return [manuscript, setManuscript];
});

const version = createManuscriptResponse().versions[0] as ManuscriptVersion;

const mockVersionData = {
  ...version,
  complianceReport: {
    ...version.complianceReport,
    discussionId: 'discussion-id',
  },
};

const baseUser = createUserResponse({}, 1);
const props: ComponentProps<typeof ManuscriptCard> & {
  teamId: string;
  useManuscriptById: jest.Mock;
} = {
  teamId: 'team-1',
  useManuscriptById,
  id: `manuscript_0`,
  user: { ...baseUser, algoliaApiKey: 'algolia-mock-key' },
  isComplianceReviewer: false,
  onUpdateManuscript: jest.fn(),
  isActiveTeam: true,
  createDiscussion: jest.fn(),
};

const complianceReport = {
  id: 'compliance-report-id',
  url: 'https://example.com',
  description: 'description',
  count: 1,
  createdDate: '2024-09-23T20:45:22.000Z',
  createdBy: manuscriptAuthor,
};

const user = {
  ...baseUser,
  teams: [
    {
      ...baseUser.teams[0],
      id: 'team-1',
      role: 'Project Manager',
    },
  ] as UserTeam[],
  algoliaApiKey: 'algolia-mock-key',
};

describe('isManuscriptAuthor', () => {
  it('returns true when user is author', () => {
    expect(
      isManuscriptAuthor({
        authors: [{ ...createUserResponse(), id: 'user-test' }],
        user: {
          ...user,
          id: 'user-test',
        },
      }),
    ).toBeTruthy();
  });
  it('returns false when user is not author', () => {
    expect(
      isManuscriptAuthor({
        authors: [{ ...createUserResponse(), id: 'different-user' }],
        user: {
          ...user,
        },
      }),
    ).not.toBeTruthy();
  });
});

describe('isManuscriptLead', () => {
  it('returns true when user is team lead', () => {
    expect(
      isManuscriptLead({
        version: createManuscriptResponse().versions[0]!,
        user: {
          ...user,
          teams: [
            {
              id: 'team-1',
              role: 'Project Manager',
            },
          ],
        },
      }),
    ).toBeTruthy();
  });
  it('returns false when user is not team lead', () => {
    expect(
      isManuscriptLead({
        version: createManuscriptResponse().versions[0]!,
        user: {
          ...user,
          teams: [
            {
              id: 'team-1',
              role: 'Scientific Advisory Board',
            },
          ],
        },
      }),
    ).not.toBeTruthy();
  });
});

afterEach(() => {
  cleanup();
});

it('displays manuscript version card when expanded', () => {
  const versionMock = {
    ...mockVersionData,
    type: 'Original Research',
    lifecycle: 'Preprint',
  };

  const { getByText, queryByText, getByTestId } = render(
    <ManuscriptCard
      {...props}
      useManuscriptById={useManuscriptById.mockImplementation(() => [
        {
          id: 'manuscript_0',
          title: 'Mock Manuscript Title',
          status: 'Waiting for Report',
          versions: [versionMock],
        },
        jest.fn(),
      ])}
    />,
  );

  expect(queryByText(/Original Research/i)).not.toBeInTheDocument();

  expect(queryByText(/Preprint/i)).not.toBeInTheDocument();

  userEvent.click(getByTestId('collapsible-button'));

  expect(getByText(/Original Research/i)).toBeVisible();
  expect(getByText(/Preprint/i)).toBeVisible();
});

it('displays share compliance report button if user has permission', () => {
  const { queryByRole, getByRole, rerender } = render(
    <ManuscriptCard {...props} />,
  );

  expect(
    queryByRole('button', { name: /Share Compliance Report Icon/i }),
  ).not.toBeInTheDocument();

  rerender(<ManuscriptCard {...props} isComplianceReviewer />);

  expect(
    getByRole('button', { name: /Share Compliance Report Icon/i }),
  ).toBeVisible();
});

it('displays submit revised manuscript button if user is an author', () => {
  const manuscriptVersions = createManuscriptResponse().versions;
  manuscriptVersions[0]!.firstAuthors = [user];
  const { getByRole } = render(
    <ManuscriptCard
      {...props}
      useManuscriptById={useManuscriptById.mockImplementation(() => [
        {
          id: 'manuscript_0',
          title: 'Mock Manuscript Title',
          status: 'Waiting for Report',
          versions: manuscriptVersions,
        },
        jest.fn(),
      ])}
    />,
  );

  expect(
    getByRole('button', { name: /Resubmit Manuscript Icon/i }),
  ).toBeVisible();
});

it('displays submit revised manuscript button if user is a PI on a manuscript lab', () => {
  const manuscriptVersions = createManuscriptResponse().versions;
  manuscriptVersions[0]!.labs = [
    { name: 'Lab 1', id: 'lab-1', labPi: user.id },
  ];
  const { getByRole } = render(
    <ManuscriptCard
      {...props}
      useManuscriptById={useManuscriptById.mockImplementation(() => [
        {
          id: 'manuscript_0',
          title: 'Mock Manuscript Title',
          status: 'Waiting for Report',
          versions: manuscriptVersions,
        },
        jest.fn(),
      ])}
    />,
  );

  expect(
    getByRole('button', { name: /Resubmit Manuscript Icon/i }),
  ).toBeVisible();
});

it('redirects to compliance report form when user clicks on share compliance report button', () => {
  const history = createMemoryHistory({});
  const { getByRole } = render(
    <Router history={history}>
      <Route path="">
        <ManuscriptCard {...props} isComplianceReviewer />
      </Route>
    </Router>,
  );

  userEvent.click(
    getByRole('button', { name: /Share Compliance Report Icon/i }),
  );

  expect(history.location.pathname).toBe(
    `/network/teams/${props.teamId}/workspace/create-compliance-report/${props.id}`,
  );
});

it('redirects to resubmit manuscript form when user clicks on Submit Revised Manuscript button', () => {
  const manuscriptVersions = createManuscriptResponse().versions;
  manuscriptVersions[0]!.firstAuthors = [user];
  manuscriptVersions[0]!.complianceReport = {
    id: 'compliance-report-id',
    url: 'https://example.com',
    description: 'test compliance report',
    count: 1,
    createdDate: manuscriptVersions[0]!.createdDate,
    createdBy: manuscriptVersions[0]!.createdBy,
  };
  const history = createMemoryHistory({});
  const { getByRole } = render(
    <Router history={history}>
      <Route path="">
        <ManuscriptCard
          {...props}
          useManuscriptById={useManuscriptById.mockImplementation(() => [
            {
              id: 'manuscript_0',
              title: 'Mock Manuscript Title',
              status: 'Waiting for Report',
              versions: manuscriptVersions,
            },
            jest.fn(),
          ])}
        />
      </Route>
    </Router>,
  );

  userEvent.click(getByRole('button', { name: /Resubmit Manuscript Icon/i }));

  expect(history.location.pathname).toBe(
    `/network/teams/${props.teamId}/workspace/resubmit-manuscript/${props.id}`,
  );
});

it('displays the confirmation modal when isComplianceReviewer is true and the user tries to change the manuscript status to a different one than it has started', () => {
  const { getByRole, getByTestId, getByText } = render(
    <ManuscriptCard {...props} isComplianceReviewer />,
  );

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeEnabled();
  userEvent.click(statusButton);
  userEvent.click(
    getByRole('button', { name: 'Information Manuscript Resubmitted' }),
  );
  expect(getByText('Update status and notify?')).toBeInTheDocument();
});

it('does not display confirmation modal when isComplianceReviewer is true but the user tries to select the same manuscript status it is currently', () => {
  const { getByRole, getByTestId, queryByText } = render(
    <ManuscriptCard
      {...props}
      useManuscriptById={useManuscriptById.mockImplementation(() => [
        {
          id: 'manuscript_0',
          title: 'Mock Manuscript Title',
          status: 'Addendum Required',
          versions: [],
        },
        jest.fn(),
      ])}
      isComplianceReviewer
    />,
  );

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeEnabled();
  userEvent.click(statusButton);
  userEvent.click(getByRole('button', { name: 'Addendum Required' }));
  expect(queryByText('Update status and notify?')).not.toBeInTheDocument();
});

it('does not allow to change the manuscript status if isComplianceReviewer is false', () => {
  const { getByTestId } = render(<ManuscriptCard {...props} />);

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeDisabled();
  cleanup();
});

it('calls onUpdateManuscript when user confirms status change', async () => {
  const onUpdateManuscript = jest.fn();

  const { getByRole, getByTestId, queryByRole } = render(
    <ManuscriptCard
      {...props}
      isComplianceReviewer
      id="manuscript-1"
      onUpdateManuscript={onUpdateManuscript}
    />,
  );

  const statusButton = getByTestId('status-button');
  userEvent.click(statusButton);
  userEvent.click(
    getByRole('button', { name: 'Information Manuscript Resubmitted' }),
  );

  await act(async () => {
    userEvent.click(
      getByRole('button', {
        name: 'Update Status and Notify',
      }),
    );
  });

  await waitFor(() => {
    expect(onUpdateManuscript).toHaveBeenCalledWith('manuscript-1', {
      status: 'Manuscript Resubmitted',
    });
  });

  expect(
    queryByRole('button', {
      name: 'Update Status and Notify',
    }),
  ).not.toBeInTheDocument();
  await waitFor(() => {
    expect(statusButton).toBeEnabled();
  });
});

it.each`
  status
  ${'Compliant'}
  ${'Closed (other)'}
`(
  'user cannot change the status anymore if they set status to $newStatus',
  async ({ status }) => {
    const onUpdateManuscript = jest.fn();
    cleanup();
    const { getByTestId } = render(
      <ManuscriptCard
        {...props}
        useManuscriptById={useManuscriptById.mockImplementation(() => [
          {
            id: 'manuscript_0',
            title: 'Mock Manuscript Title',
            status,
            versions: [],
          },
          jest.fn(),
        ])}
        isComplianceReviewer
        id="manuscript-1"
        onUpdateManuscript={onUpdateManuscript}
      />,
    );

    expect(getByTestId('status-button')).toBeDisabled();
  },
);
it.each`
  newStatus           | submissionButtonText
  ${'Compliant'}      | ${'Set to Compliant and Notify'}
  ${'Closed (other)'} | ${'Set to Closed (other) and Notify'}
`(
  'shows correct modal when updating to $newStatus and calls onUpdateManuscript with correct status',
  async ({ newStatus, submissionButtonText }) => {
    const onUpdateManuscript = jest.fn();
    cleanup();
    const { getByRole, getByTestId, queryByRole, getByText } = render(
      <ManuscriptCard
        {...props}
        useManuscriptById={useManuscriptById.mockImplementation(() => [
          {
            id: 'manuscript_0',
            title: 'Mock Manuscript Title',
            status: 'Waiting for Report',
            versions: [],
          },
          jest.fn(),
        ])}
        isComplianceReviewer
        id="manuscript-1"
        onUpdateManuscript={onUpdateManuscript}
      />,
    );

    const statusButton = getByTestId('status-button');
    userEvent.click(statusButton);
    await waitFor(() => {
      getByRole('button', { name: newStatus });
    });
    await act(async () => {
      userEvent.click(getByRole('button', { name: newStatus }));
    });

    await waitFor(() => {
      expect(
        getByRole('button', {
          name: submissionButtonText,
        }),
      ).toBeInTheDocument();
    });

    await act(async () => {
      userEvent.click(
        getByRole('button', {
          name: submissionButtonText,
        }),
      );
    });

    await waitFor(async () => {
      expect(
        queryByRole('button', {
          name: submissionButtonText,
        }),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(onUpdateManuscript).toHaveBeenCalledWith('manuscript-1', {
        status: newStatus,
      });
      expect(getByText(newStatus)).toBeInTheDocument();
    });
  },
);

it('disables submit compliance report button when there is an existing compliance report', async () => {
  const manuscriptVersions = createManuscriptResponse().versions;
  manuscriptVersions[0]!.complianceReport = complianceReport;

  const { getByRole } = render(
    <ManuscriptCard
      {...props}
      useManuscriptById={useManuscriptById.mockImplementation(() => [
        {
          id: 'manuscript_0',
          title: 'Mock Manuscript Title',
          status: 'Waiting for Report',
          versions: manuscriptVersions,
        },
        jest.fn(),
      ])}
      isComplianceReviewer
      id="manuscript-1"
    />,
  );

  const complianceReportButton = getByRole('button', {
    name: /Share Compliance Report Icon/i,
  });
  expect(complianceReportButton).toBeDisabled();
});

it.each`
  status                  | isActiveTeam
  ${'Compliant'}          | ${true}
  ${'Waiting for Report'} | ${false}
  ${'Closed (other)'}     | ${true}
`(
  'does not display submit compliance report if team isActiveTeam is $isActiveTeam and status is $status',
  async ({ status, isActiveTeam }) => {
    const { queryByRole } = render(
      <ManuscriptCard
        {...props}
        useManuscriptById={useManuscriptById.mockImplementation(() => [
          {
            id: 'manuscript_0',
            title: 'Mock Manuscript Title',
            status,
            versions: [],
          },
          jest.fn(),
        ])}
        isComplianceReviewer
        id="manuscript-1"
        isActiveTeam={isActiveTeam}
      />,
    );

    expect(
      queryByRole('button', {
        name: /Share Compliance Report Icon/i,
      }),
    ).not.toBeInTheDocument();
  },
);

describe('Tabs', () => {
  it('displays the manuscript and reports tab as active by default', () => {
    const { getByRole, getByTestId } = render(<ManuscriptCard {...props} />);

    userEvent.click(getByTestId('collapsible-button'));

    expect(
      getByRole('button', { name: 'Manuscripts and Reports' }),
    ).toHaveClass('active');
  });

  it('displays the tab as active when the user clicks on the tab', () => {
    const { getByRole, getByTestId } = render(<ManuscriptCard {...props} />);

    userEvent.click(getByTestId('collapsible-button'));

    userEvent.click(getByRole('button', { name: 'Discussions' }));

    expect(getByRole('button', { name: 'Discussions' })).toHaveClass('active');
    expect(
      getByRole('button', { name: 'Manuscripts and Reports' }),
    ).not.toHaveClass('active');

    userEvent.click(getByRole('button', { name: 'Manuscripts and Reports' }));

    expect(
      getByRole('button', { name: 'Manuscripts and Reports' }),
    ).toHaveClass('active');
    expect(getByRole('button', { name: 'Discussions' })).not.toHaveClass(
      'active',
    );
  });
});
