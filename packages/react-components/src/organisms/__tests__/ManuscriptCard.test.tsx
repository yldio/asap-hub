import { createManuscriptResponse } from '@asap-hub/fixtures';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ManuscriptCard from '../ManuscriptCard';
import { ManuscriptStatus } from '@asap-hub/model';

const props: ComponentProps<typeof ManuscriptCard> = {
  ...createManuscriptResponse(),
  teamIdCode: 'TI1',
  grantId: '000123',
  isComplianceReviewer: false,
  onUpdateManuscript: jest.fn(),
  onReplyToDiscussion: jest.fn(),
  getDiscussion: jest.fn(),
};

it('displays manuscript version card when expanded', () => {
  const { getByText, queryByText, getByTestId, rerender } = render(
    <ManuscriptCard {...props} />,
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

it('compliance report button is disabled if there is a compliance report', () => {
  const { getByRole } = render(
    <ManuscriptCard
      {...props}
      isComplianceReviewer
      status="Waiting for Grantee's Reply"
      versions={[
        {
          ...props.versions[0]!,
          complianceReport: {
            description: 'Some description',
            url: 'https://example.com/compliance-report',
          },
        },
      ]}
    />,
  );

  expect(
    getByRole('button', { name: /Share Compliance Report Icon/i }),
  ).toBeDisabled();
});

it.each(['Compliant', 'Closed (other)'])(
  'compliance report button is disabled if status is %s',
  (status) => {
    const { getByRole } = render(
      <ManuscriptCard
        {...props}
        isComplianceReviewer
        versions={[
          {
            ...props.versions[0]!,
            complianceReport: undefined,
          },
        ]}
        status={status as ManuscriptStatus}
      />,
    );

    expect(
      getByRole('button', { name: /Share Compliance Report Icon/i }),
    ).toBeDisabled();
  },
);

it.each([
  'Waiting for Report',
  'Review Compliance Report',
  'Waiting for ASAP Reply',
  "Waiting for Grantee's Reply",
  'Manuscript Resubmitted',
  'Submit Final Publication',
  'Addendum Required',
])(
  'compliance report button is enabled if there is no compliance report and status is %s',
  (status) => {
    const { getByRole } = render(
      <ManuscriptCard
        {...props}
        isComplianceReviewer
        versions={[
          {
            ...props.versions[0]!,
            complianceReport: undefined,
          },
        ]}
        status={status as ManuscriptStatus}
      />,
    );

    expect(
      getByRole('button', { name: /Share Compliance Report Icon/i }),
    ).toBeEnabled();
  },
);

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
  userEvent.click(getByRole('button', { name: 'Manuscript Resubmitted' }));
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
  userEvent.click(getByRole('button', { name: 'Addendum Required' }));
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
  userEvent.click(getByRole('button', { name: 'Manuscript Resubmitted' }));

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
