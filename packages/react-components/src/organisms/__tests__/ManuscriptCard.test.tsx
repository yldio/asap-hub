import {
  createManuscriptResponse,
  createUserResponse,
  manuscriptAuthor,
} from '@asap-hub/fixtures';
import {
  ManuscriptDiscussion,
  ManuscriptVersion,
  UserTeam,
} from '@asap-hub/model';
import { cleanup, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, useEffect } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ManuscriptCard from '../ManuscriptCard';

let currentLocation: { pathname: string; search: string } | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentLocation = { pathname: location.pathname, search: location.search };
  }, [location]);
  return null;
};

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
  onReplyToDiscussion: jest.fn(),
  onMarkDiscussionAsRead: jest.fn(),
};

const complianceReport = {
  id: 'compliance-report-id',
  url: 'https://example.com',
  description: 'description',
  count: 1,
  createdDate: '2024-09-23T20:45:22.000Z',
  createdBy: manuscriptAuthor,
  status: 'Review Compliance Report',
};

const mockVersion = {
  ...createManuscriptResponse().versions[0],
  type: 'Original Research',
  lifecycle: 'Preprint',
} as ManuscriptVersion;

const mockVersionWithReport = {
  ...mockVersion,
  complianceReport: {
    ...complianceReport,
  },
};

const useManuscriptByIdWithReport = jest.fn();

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

beforeEach(() => {
  currentLocation = null;
  useManuscriptById.mockImplementation(() => {
    const manuscript = {
      id: 'manuscript_0',
      title: 'Mock Manuscript Title',
      status: 'Waiting for Report',
      versions: [mockVersion],
    };

    const setManuscript = jest.fn((newData) => {
      Object.assign(manuscript, newData);
    });

    return [manuscript, setManuscript];
  });
  useManuscriptByIdWithReport.mockImplementation(() => {
    const manuscript = {
      id: 'manuscript_0',
      title: 'Mock Manuscript Title',
      status: 'Waiting for Report',
      versions: [mockVersionWithReport],
    };

    const setManuscript = jest.fn((newData) => {
      Object.assign(manuscript, newData);
    });

    return [manuscript, setManuscript];
  });
});

it('displays manuscript version card when expanded', async () => {
  const userActions = userEvent.setup();
  const { getByText, queryByText, getByTestId } = render(
    <MemoryRouter>
      <ManuscriptCard {...props} />
    </MemoryRouter>,
  );

  expect(queryByText(/Original Research/i)).not.toBeInTheDocument();

  expect(queryByText(/Preprint/i)).not.toBeInTheDocument();

  await userActions.click(getByTestId('collapsible-button'));

  expect(getByText(/Original Research/i)).toBeVisible();
  expect(getByText(/Preprint/i)).toBeVisible();
});

it('displays share compliance report button if user has permission', async () => {
  const userActions = userEvent.setup();
  const { queryByRole, getByRole, rerender, getByTestId } = render(
    <MemoryRouter>
      <ManuscriptCard {...props} />
    </MemoryRouter>,
  );
  await userActions.click(getByTestId('collapsible-button'));

  expect(
    queryByRole('button', { name: /Share Compliance Report Icon/i }),
  ).not.toBeInTheDocument();

  rerender(
    <MemoryRouter>
      <ManuscriptCard {...props} isComplianceReviewer />
    </MemoryRouter>,
  );

  expect(
    getByRole('button', { name: /Share Compliance Report Icon/i }),
  ).toBeVisible();
});

it('displays submit revised manuscript button if user is an author', async () => {
  const userActions = userEvent.setup();
  const manuscriptVersions = [
    {
      ...mockVersionWithReport,
      firstAuthors: [user],
    },
  ];

  const { getByRole, getByTestId } = render(
    <MemoryRouter>
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
    </MemoryRouter>,
  );
  await userActions.click(getByTestId('collapsible-button'));

  expect(
    getByRole('button', { name: /Resubmit Manuscript Icon/i }),
  ).toBeVisible();
});

it('shows tooltip on hover over disabled Submit Revised Manuscript button when no compliance report exists', async () => {
  const userActions = userEvent.setup();
  const manuscriptVersions = [
    {
      ...mockVersion,
      firstAuthors: [user],
      complianceReport: undefined,
    },
  ];

  const { getByRole, getByTestId, findByRole, queryByRole } = render(
    <MemoryRouter>
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
    </MemoryRouter>,
  );
  await userActions.click(getByTestId('collapsible-button'));

  const button = getByRole('button', { name: /Submit Revised Manuscript/i });
  expect(button).toBeDisabled();

  const span = button.querySelector('span');
  await userActions.hover(span!);

  const tooltip = await findByRole('tooltip');
  expect(tooltip).toHaveTextContent(
    'A compliance report must be shared by an Open Science team member before submitting a new version of the manuscript.',
  );

  await userActions.unhover(span!);
  await waitFor(() => {
    expect(queryByRole('tooltip')).not.toBeInTheDocument();
  });
});

it('displays submit revised manuscript button if user is team Lead PI', async () => {
  const userActions = userEvent.setup();
  const piUser = {
    ...user,
    teams: [
      {
        ...user.teams[0],
        role: 'Lead PI (Core Leadership)',
      },
    ] as UserTeam[],
  };
  const { getByRole, getByTestId } = render(
    <MemoryRouter>
      <ManuscriptCard
        {...props}
        useManuscriptById={useManuscriptByIdWithReport}
        user={piUser}
      />
    </MemoryRouter>,
  );
  await userActions.click(getByTestId('collapsible-button'));

  expect(
    getByRole('button', { name: /Resubmit Manuscript Icon/i }),
  ).toBeVisible();
});

it('displays submit revised manuscript button if user is team project manager', async () => {
  const userActions = userEvent.setup();
  const { getByRole, getByTestId } = render(
    <MemoryRouter>
      <ManuscriptCard
        {...props}
        useManuscriptById={useManuscriptByIdWithReport}
        user={user}
      />
    </MemoryRouter>,
  );
  await userActions.click(getByTestId('collapsible-button'));

  expect(
    getByRole('button', { name: /Resubmit Manuscript Icon/i }),
  ).toBeVisible();
});

it('displays submit revised manuscript button if user is a PI on a manuscript lab', async () => {
  const userActions = userEvent.setup();
  const manuscriptVersions = [
    {
      ...mockVersionWithReport,
      labs: [{ name: 'Lab 1', id: 'lab-1', labPi: user.id }],
    },
  ];
  const { getByRole, getByTestId } = render(
    <MemoryRouter>
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
    </MemoryRouter>,
  );

  await userActions.click(getByTestId('collapsible-button'));

  expect(
    getByRole('button', { name: /Resubmit Manuscript Icon/i }),
  ).toBeVisible();
});

it('redirects to compliance report form when user clicks on share compliance report button', async () => {
  const userActions = userEvent.setup();
  const { getByRole, getByTestId } = render(
    <MemoryRouter>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <LocationCapture />
              <ManuscriptCard {...props} isComplianceReviewer />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  await userActions.click(getByTestId('collapsible-button'));
  await userActions.click(
    getByRole('button', { name: /Share Compliance Report Icon/i }),
  );

  expect(currentLocation?.pathname).toBe(
    `/network/teams/${props.teamId}/workspace/create-compliance-report/${props.id}`,
  );
});

it('redirects to resubmit manuscript form when user clicks on Submit Revised Manuscript button', async () => {
  const userActions = userEvent.setup();
  const manuscriptVersions = [
    {
      ...mockVersionWithReport,
      firstAuthors: [user],
    },
  ];

  const { getByRole, getByTestId } = render(
    <MemoryRouter>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <LocationCapture />
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
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  await userActions.click(getByTestId('collapsible-button'));

  await userActions.click(
    getByRole('button', { name: /Resubmit Manuscript Icon/i }),
  );

  expect(currentLocation?.pathname).toBe(
    `/network/teams/${props.teamId}/workspace/resubmit-manuscript/${props.id}`,
  );
});

it('displays the confirmation modal when isComplianceReviewer is true and the user tries to change the manuscript status to a different one than it has started', async () => {
  const userActions = userEvent.setup();
  const { getByRole, getByTestId, getByText } = render(
    <MemoryRouter>
      <ManuscriptCard {...props} isComplianceReviewer />
    </MemoryRouter>,
  );

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeEnabled();
  await userActions.click(statusButton);
  await userActions.click(getByRole('button', { name: 'Addendum Required' }));
  expect(getByText('Update status and notify?')).toBeInTheDocument();
});

it('does not display confirmation modal when isComplianceReviewer is true but the user tries to select the same manuscript status it is currently', async () => {
  const userActions = userEvent.setup();
  const { getByRole, getByTestId, queryByText } = render(
    <MemoryRouter>
      <ManuscriptCard
        {...props}
        isComplianceReviewer
        useManuscriptById={useManuscriptById.mockImplementation(() => [
          {
            id: 'manuscript_0',
            title: 'Mock Manuscript Title',
            status: 'Addendum Required',
            versions: [],
          },
          jest.fn(),
        ])}
      />
    </MemoryRouter>,
  );

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeEnabled();
  await userActions.click(statusButton);
  await userActions.click(getByRole('button', { name: /Addendum Required$/ }));
  expect(queryByText('Update status and notify?')).not.toBeInTheDocument();
});

it('does not allow to change the manuscript status if isComplianceReviewer is false', () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <ManuscriptCard {...props} />
    </MemoryRouter>,
  );

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeDisabled();
  cleanup();
});

it('calls onUpdateManuscript when user confirms status change', async () => {
  const userActions = userEvent.setup();
  const onUpdateManuscript = jest.fn();

  const { getByRole, getByTestId, queryByRole } = render(
    <MemoryRouter>
      <ManuscriptCard
        {...props}
        isComplianceReviewer
        id="manuscript-1"
        onUpdateManuscript={onUpdateManuscript}
      />
    </MemoryRouter>,
  );

  const statusButton = getByTestId('status-button');
  await userActions.click(statusButton);
  await userActions.click(getByRole('button', { name: 'Addendum Required' }));

  await userActions.click(
    getByRole('button', {
      name: 'Update Status and Notify',
    }),
  );

  await waitFor(() => {
    expect(onUpdateManuscript).toHaveBeenCalledWith('manuscript-1', {
      status: 'Addendum Required',
    });
    expect(
      queryByRole('button', {
        name: 'Update Status and Notify',
      }),
    ).not.toBeInTheDocument();
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
      <MemoryRouter>
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
        />
      </MemoryRouter>,
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
    const userActions = userEvent.setup({ delay: null });
    const onUpdateManuscript = jest.fn().mockResolvedValue({
      id: 'manuscript_0',
      title: 'Mock Manuscript Title',
      status: newStatus,
      versions: [],
    });
    cleanup();
    const { getByTestId, queryByRole, findByRole, findByText } = render(
      <MemoryRouter>
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
        />
      </MemoryRouter>,
    );

    const statusButton = getByTestId('status-button');
    await userActions.click(statusButton);

    const statusOptionButton = await findByRole('button', { name: newStatus });
    await userActions.click(statusOptionButton);

    const submitButton = await findByRole('button', {
      name: submissionButtonText,
    });
    await userActions.click(submitButton);

    await waitFor(() => {
      expect(
        queryByRole('button', {
          name: submissionButtonText,
        }),
      ).not.toBeInTheDocument();
    });

    expect(onUpdateManuscript).toHaveBeenCalledWith('manuscript-1', {
      status: newStatus,
    });
    expect(await findByText(newStatus)).toBeInTheDocument();
  },
);

it('disables submit compliance report button when there is an existing compliance report', async () => {
  const userActions = userEvent.setup();
  const { getByRole, getByTestId } = render(
    <MemoryRouter>
      <ManuscriptCard
        {...props}
        isComplianceReviewer
        id="manuscript-1"
        useManuscriptById={useManuscriptByIdWithReport}
      />
    </MemoryRouter>,
  );

  await userActions.click(getByTestId('collapsible-button'));

  const complianceReportButton = getByRole('button', {
    name: /Share Compliance Report Icon/i,
  });
  expect(complianceReportButton).toBeDisabled();
});

it('displays show more/show less when there are more than three manuscript versions', async () => {
  const userActions = userEvent.setup();
  const manuscriptVersions = [
    {
      ...mockVersionWithReport,
      id: 'version-1',
    },
    {
      ...mockVersionWithReport,
      id: 'version-2',
    },
    {
      ...mockVersionWithReport,
      id: 'version-3',
    },
    {
      ...mockVersionWithReport,
      id: 'version-4',
    },
  ];
  const { getByRole, getByTestId } = render(
    <MemoryRouter>
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
    </MemoryRouter>,
  );

  await userActions.click(getByTestId('collapsible-button'));
  const showMoreButton = getByRole('button', {
    name: /Show more/i,
  });

  expect(showMoreButton).toBeVisible();

  await userActions.click(showMoreButton);
  expect(getByRole('button', { name: /Show less/i })).toBeVisible();
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
      <MemoryRouter>
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
        />
      </MemoryRouter>,
    );

    expect(
      queryByRole('button', {
        name: /Share Compliance Report Icon/i,
      }),
    ).not.toBeInTheDocument();
  },
);

describe('Tabs', () => {
  it('displays the manuscript and reports tab as active by default', async () => {
    const userActions = userEvent.setup();
    const { getByRole, getByTestId } = render(
      <MemoryRouter>
        <ManuscriptCard {...props} />
      </MemoryRouter>,
    );

    await userActions.click(getByTestId('collapsible-button'));

    expect(
      getByRole('button', { name: 'Manuscripts and Reports' }),
    ).toHaveClass('active');
  });

  it('displays the tab as active when the user clicks on the tab', async () => {
    const userActions = userEvent.setup();
    const { getByRole, getByTestId } = render(
      <MemoryRouter>
        <ManuscriptCard {...props} />
      </MemoryRouter>,
    );

    await userActions.click(getByTestId('collapsible-button'));

    await userActions.click(getByRole('button', { name: 'Discussions' }));

    expect(getByRole('button', { name: 'Discussions' })).toHaveClass('active');
    expect(
      getByRole('button', { name: 'Manuscripts and Reports' }),
    ).not.toHaveClass('active');

    await userActions.click(
      getByRole('button', { name: 'Manuscripts and Reports' }),
    );

    expect(
      getByRole('button', { name: 'Manuscripts and Reports' }),
    ).toHaveClass('active');
    expect(getByRole('button', { name: 'Discussions' })).not.toHaveClass(
      'active',
    );
  });

  it('opens the discussions tab when user clicks on Open Discussion Tab', async () => {
    const userActions = userEvent.setup();
    const manuscriptVersion = {
      ...mockVersion,
      asapAffiliationIncluded: 'No',
      asapAffiliationIncludedDetails: 'Reason',
    };
    const { getByLabelText, getByRole, getByTestId } = render(
      <MemoryRouter>
        <ManuscriptCard
          {...props}
          useManuscriptById={useManuscriptById.mockImplementation(() => [
            {
              id: 'manuscript_0',
              title: 'Mock Manuscript Title',
              status: 'Waiting for Report',
              versions: [manuscriptVersion],
            },
            jest.fn(),
          ])}
        />
      </MemoryRouter>,
    );

    await userActions.click(getByTestId('collapsible-button'));
    await userActions.click(getByLabelText('Expand Version'));

    expect(getByRole('button', { name: 'Discussions' })).not.toHaveClass(
      'active',
    );
    const openDiscussionsButton = getByRole('button', {
      name: /Open Discussion Tab/i,
    });
    expect(openDiscussionsButton).toBeVisible();

    await userActions.click(openDiscussionsButton);
    expect(getByRole('button', { name: 'Discussions' })).toHaveClass('active');
  });
});

describe('Discussion Notification', () => {
  const getBaseDiscussion = (
    baseDiscussionProps: Partial<ManuscriptDiscussion>,
  ) => ({
    id: 'discussion-1',
    title: 'Discussion 1',
    read: false,
    replies: [],
    createdBy: {
      id: 'user-1',
      displayName: 'User 1',
      firstName: 'User',
      lastName: 'One',
      avatarUrl: '',
      alumniSinceDate: undefined,
      teams: [{ id: 'team-1', name: 'Team 1' }],
    },
    createdDate: '2024-01-01T00:00:00Z',
    lastUpdatedAt: '2024-01-01T00:00:00Z',
    text: 'Test discussion',
    ...baseDiscussionProps,
  });

  const manuscriptVersion = {
    ...mockVersion,
    asapAffiliationIncluded: 'No',
    asapAffiliationIncludedDetails: 'Reason',
  };

  it('displays the notification dot when there is at least one unread discussion', async () => {
    const userActions = userEvent.setup();
    const { getByLabelText, getByTitle, getByTestId } = render(
      <MemoryRouter>
        <ManuscriptCard
          {...props}
          useManuscriptById={useManuscriptById.mockImplementation(() => [
            {
              id: 'manuscript_0',
              title: 'Mock Manuscript Title',
              status: 'Waiting for Report',
              versions: [manuscriptVersion],
              discussions: [
                getBaseDiscussion({ read: true }),
                getBaseDiscussion({ read: true }),
                getBaseDiscussion({ read: false }),
              ],
            },
            jest.fn(),
          ])}
        />
      </MemoryRouter>,
    );

    await userActions.click(getByTestId('collapsible-button'));
    await userActions.click(getByLabelText('Expand Version'));

    expect(getByTitle(/notification dot/i)).toBeInTheDocument();
  });

  it('does not display the notification dot when there are no unread discussions', () => {
    const { queryByTitle } = render(
      <MemoryRouter>
        <ManuscriptCard
          {...props}
          useManuscriptById={useManuscriptById.mockImplementation(() => [
            {
              id: 'manuscript_0',
              title: 'Mock Manuscript Title',
              status: 'Waiting for Report',
              versions: [],
              discussions: [
                getBaseDiscussion({ read: true }),
                getBaseDiscussion({ read: true }),
                getBaseDiscussion({ read: true }),
              ],
            },
            jest.fn(),
          ])}
        />
      </MemoryRouter>,
    );

    expect(queryByTitle(/notification dot/i)).not.toBeInTheDocument();
  });

  it('does not display the notification dot when there are no discussions', () => {
    const { queryByTitle } = render(
      <MemoryRouter>
        <ManuscriptCard
          {...props}
          useManuscriptById={useManuscriptById.mockImplementation(() => [
            {
              id: 'manuscript_0',
              title: 'Mock Manuscript Title',
              status: 'Waiting for Report',
              versions: [],
              discussions: [],
            },
            jest.fn(),
          ])}
        />
      </MemoryRouter>,
    );

    expect(queryByTitle(/notification dot/i)).not.toBeInTheDocument();
  });
});
