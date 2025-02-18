import { manuscriptStatus } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  info100,
  info200,
  info500,
  lead,
  steel,
  success100,
  success500,
  warning100,
  warning150,
  warning500,
} from '../../colors';
import ManuscriptByStatus from '../ManuscriptByStatus';

describe('ManuscriptByStatus', () => {
  const mockOnSelectStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all manuscript statuses when shouldHideCompleteStatus is false', () => {
    render(
      <ManuscriptByStatus
        isComplianceReviewer={false}
        selectedStatuses={[]}
        onSelectStatus={mockOnSelectStatus}
        shouldHideCompleteStatus={false}
      />,
    );

    manuscriptStatus.forEach((status) => {
      expect(screen.getByText(status)).toBeInTheDocument();
    });
  });

  it('hides Compliant and Closed (other) statuses when shouldHideCompleteStatus is true', () => {
    render(
      <ManuscriptByStatus
        isComplianceReviewer={false}
        selectedStatuses={[]}
        onSelectStatus={mockOnSelectStatus}
        shouldHideCompleteStatus={true}
      />,
    );

    expect(screen.queryByText('Compliant')).not.toBeInTheDocument();
    expect(screen.queryByText('Closed (other)')).not.toBeInTheDocument();
  });

  it('calls onSelectStatus when a status button is clicked', () => {
    render(
      <ManuscriptByStatus
        isComplianceReviewer={false}
        selectedStatuses={[]}
        onSelectStatus={mockOnSelectStatus}
        shouldHideCompleteStatus={false}
      />,
    );

    const statusButton = screen.getByText('Waiting for Report');
    userEvent.click(statusButton);

    expect(mockOnSelectStatus).toHaveBeenCalledWith('Waiting for Report');
  });

  it('applies selected styles to selected status buttons', () => {
    render(
      <ManuscriptByStatus
        isComplianceReviewer={false}
        selectedStatuses={[
          'Waiting for Report',
          'Compliant',
          'Submit Final Publication',
        ]}
        onSelectStatus={mockOnSelectStatus}
        shouldHideCompleteStatus={false}
      />,
    );

    const selectedWarningButton = screen
      .getByText('Waiting for Report')
      .closest('button');

    const selectedFinalButton = screen.getByText('Compliant').closest('button');

    const selectedDefaultButton = screen
      .getByText('Submit Final Publication')
      .closest('button');

    const unselectedButton = screen
      .getByText('Review Compliance Report')
      .closest('button');

    expect(selectedWarningButton).toHaveStyle({
      backgroundColor: warning100.rgb,
      borderColor: warning150.rgb,
      color: warning500.rgb,
    });
    expect(selectedFinalButton).toHaveStyle({
      backgroundColor: success100.rgb,
      borderColor: info200.rgb,
      color: success500.rgb,
    });
    expect(selectedDefaultButton).toHaveStyle({
      backgroundColor: info100.rgb,
      borderColor: info500.rgb,
      color: info500.rgb,
    });
    expect(unselectedButton).toHaveStyle({
      backgroundColor: 'white',
      borderColor: steel.rgb,
      color: lead.rgb,
    });
  });

  it('shows icons for warning and final status types', () => {
    render(
      <ManuscriptByStatus
        isComplianceReviewer={true}
        selectedStatuses={[]}
        onSelectStatus={mockOnSelectStatus}
        shouldHideCompleteStatus={false}
      />,
    );

    const waitingForReportButton = screen
      .getByText('Waiting for Report')
      .closest('button');
    expect(waitingForReportButton?.querySelector('svg')).toBeInTheDocument();

    const compliantButton = screen.getByText('Compliant').closest('button');
    expect(compliantButton?.querySelector('svg')).toBeInTheDocument();

    const reviewComplianceReportButton = screen
      .getByText('Review Compliance Report')
      .closest('button');
    expect(
      reviewComplianceReportButton?.querySelector('svg'),
    ).not.toBeInTheDocument();
  });

  it('does not render status buttons with type "none"', () => {
    jest
      // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
      .spyOn(require('../ManuscriptCard'), 'getReviewerStatusType')
      .mockImplementation((status) =>
        status === 'Closed (other)' ? 'none' : 'default',
      );

    render(
      <ManuscriptByStatus
        isComplianceReviewer={false}
        selectedStatuses={[]}
        onSelectStatus={mockOnSelectStatus}
        shouldHideCompleteStatus={false}
      />,
    );

    expect(screen.queryByText('Closed (other)')).not.toBeInTheDocument();
  });
});
