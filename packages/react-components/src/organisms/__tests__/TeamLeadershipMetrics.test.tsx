import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TeamLeadershipMetrics from '../TeamLeadershipMetrics';

const defaultProps = {
  workingGroupLead: true,
  interestGroupLead: false,
};

const mockScrollHeight = (scrollHeight: number) => {
  const original = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollHeight',
  );
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  });
  return () => {
    if (original) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', original);
    } else {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollHeight');
    }
  };
};

describe('TeamLeadershipMetrics', () => {
  it('renders metric and status information', () => {
    render(<TeamLeadershipMetrics {...defaultProps} />);

    expect(screen.getAllByText('Metric')).toHaveLength(3);
    expect(screen.getAllByText('Status')).toHaveLength(3);
    expect(screen.getByText('Working Group(s) Lead')).toBeInTheDocument();
    expect(screen.getByText('Interest Group(s) Lead')).toBeInTheDocument();
    expect(screen.getByText('Y')).toBeInTheDocument();
    expect(screen.getByText('N')).toBeInTheDocument();
  });

  it('keeps desktop metric details collapsed initially', () => {
    render(<TeamLeadershipMetrics {...defaultProps} />);

    expect(
      screen.queryByTestId('team-leadership-details-desktop'),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByTestId('team-leadership-details-mobile'),
    ).toHaveLength(2);
  });

  it('always shows philosophy and definition in the mobile expandable text', () => {
    render(<TeamLeadershipMetrics {...defaultProps} />);
    const mobileDetails = screen.getAllByTestId(
      'team-leadership-details-mobile',
    )[0]!;

    expect(
      within(mobileDetails).getByText('ASAP Philosophy'),
    ).toBeInTheDocument();
    expect(
      within(mobileDetails).getByText('Metric Definition'),
    ).toBeInTheDocument();
  });

  it('expands and collapses an individual metric on desktop', async () => {
    const user = userEvent.setup();
    render(<TeamLeadershipMetrics {...defaultProps} />);

    const expandButton = screen.getByLabelText('Expand Working Group(s) Lead');
    await user.click(expandButton);

    const desktopDetails = screen.getByTestId(
      'team-leadership-details-desktop',
    );
    expect(
      within(desktopDetails).getByText('Metric Definition'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Collapse Working Group(s) Lead'),
    ).toBeInTheDocument();

    await user.click(screen.getByLabelText('Collapse Working Group(s) Lead'));
    expect(
      screen.queryByTestId('team-leadership-details-desktop'),
    ).not.toBeInTheDocument();
  });

  it('expands overflowing mobile details once and hides the toggle', async () => {
    const restoreScrollHeight = mockScrollHeight(500);
    try {
      const user = userEvent.setup();
      render(<TeamLeadershipMetrics {...defaultProps} />);

      const showMoreButtons = screen.getAllByRole('button', {
        name: /Show more/i,
      });
      expect(showMoreButtons).toHaveLength(2);
      await user.click(showMoreButtons[0]!);

      expect(
        screen.getAllByRole('button', { name: /Show more/i }),
      ).toHaveLength(1);
      expect(
        screen.queryByRole('button', { name: /Show less/i }),
      ).not.toBeInTheDocument();
    } finally {
      restoreScrollHeight();
    }
  });
});
