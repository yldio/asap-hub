import {
  createManuscriptResponse,
  createUserResponse,
  manuscriptAuthor,
} from '@asap-hub/fixtures';
import { ManuscriptVersion, UserTeam } from '@asap-hub/model';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ManuscriptCard, {
  isManuscriptAuthor,
  isManuscriptLead,
} from '../ManuscriptCard';

const version = createManuscriptResponse().versions[0] as ManuscriptVersion;

const mockVersionData = {
  ...version,
  complianceReport: {
    ...version.complianceReport,
    discussionId: 'discussion-id',
  },
};

const baseUser = createUserResponse({}, 1);
const props: ComponentProps<typeof ManuscriptCard> = {
  ...createManuscriptResponse(),
  user: { ...baseUser, algoliaApiKey: 'algolia-mock-key' },
  teamIdCode: 'TI1',
  grantId: '000123',
  isComplianceReviewer: false,
  onUpdateManuscript: jest.fn(),
  onReplyToDiscussion: jest.fn(),
  getDiscussion: jest.fn(),
  isTeamMember: true,
  isActiveTeam: true,
  createComplianceDiscussion: jest.fn(),
  useVersionById: jest.fn(),
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
        version: props.versions[0],
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
        version: props.versions[0],
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

it('displays manuscript version card when expanded', () => {
  const useVersionById = jest.fn();

  useVersionById
    .mockImplementation(() => [
      {
        ...mockVersionData,
        type: 'Original Research',
        lifecycle: 'Preprint',
      },
      jest.fn(),
    ])
    .mockImplementationOnce(() => [mockVersionData, jest.fn()]);

  const { getByText, queryByText, getByTestId, rerender } = render(
    <ManuscriptCard {...props} useVersionById={useVersionById} />,
  );

  expect(queryByText(/Original Research/i)).not.toBeInTheDocument();

  expect(queryByText(/Preprint/i)).not.toBeInTheDocument();

  userEvent.click(getByTestId('collapsible-button'));

  rerender(
    <ManuscriptCard
      {...props}
      versions={[
        {
          ...props.versions[0]!,
          type: 'Original Research',
          lifecycle: 'Preprint',
        },
      ]}
      useVersionById={useVersionById}
    />,
  );

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
    <ManuscriptCard {...props} versions={manuscriptVersions} />,
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
        <ManuscriptCard {...props} versions={manuscriptVersions} />
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
    <ManuscriptCard
      {...props}
      isComplianceReviewer
      status="Addendum Required"
    />,
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
      isComplianceReviewer
      status="Addendum Required"
    />,
  );

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeEnabled();
  userEvent.click(statusButton);
  userEvent.click(
    getByRole('button', { name: 'Information Addendum Required' }),
  );
  expect(queryByText('Update status and notify?')).not.toBeInTheDocument();
});

it('does not allow to change the manuscript status if isComplianceReviewer is false', () => {
  const { getByTestId } = render(<ManuscriptCard {...props} />);

  const statusButton = getByTestId('status-button');
  expect(statusButton).toBeDisabled();
});

it('calls onUpdateManuscript when user confirms status change', async () => {
  const onUpdateManuscript = jest.fn();

  const { getByRole, getByTestId, queryByText, queryByRole } = render(
    <ManuscriptCard
      {...props}
      isComplianceReviewer
      status="Addendum Required"
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
  expect(queryByText('Addendum Required')).not.toBeVisible();
  expect(statusButton).toBeEnabled();
});

it.each`
  newStatus           | submissionButtonText
  ${'Compliant'}      | ${'Set to Compliant and Notify'}
  ${'Closed (other)'} | ${'Set to Closed (other) and Notify'}
`(
  'user cannot change the status anymore if they set status to $newStatus',
  async ({ newStatus, submissionButtonText }) => {
    const onUpdateManuscript = jest.fn();

    const { getByRole, getByTestId, queryByRole } = render(
      <ManuscriptCard
        {...props}
        isComplianceReviewer
        status="Addendum Required"
        id="manuscript-1"
        onUpdateManuscript={onUpdateManuscript}
      />,
    );

    const statusButton = getByTestId('status-button');
    userEvent.click(statusButton);
    userEvent.click(getByRole('button', { name: newStatus }));

    await act(async () => {
      userEvent.click(
        getByRole('button', {
          name: submissionButtonText,
        }),
      );
    });

    expect(
      queryByRole('button', {
        name: submissionButtonText,
      }),
    ).not.toBeInTheDocument();

    expect(statusButton).toBeDisabled();
  },
);

it('disables submit compliance report button when there is an existing compliance report', async () => {
  const manuscriptVersions = createManuscriptResponse().versions;
  manuscriptVersions[0]!.complianceReport = complianceReport;

  const { getByRole } = render(
    <ManuscriptCard
      {...props}
      isComplianceReviewer
      status="Waiting for Report"
      id="manuscript-1"
      versions={manuscriptVersions}
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
    const manuscriptVersions = createManuscriptResponse().versions;

    const { queryByRole } = render(
      <ManuscriptCard
        {...props}
        isComplianceReviewer
        status={status}
        id="manuscript-1"
        versions={manuscriptVersions}
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
