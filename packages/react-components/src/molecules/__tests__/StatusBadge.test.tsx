import { render, screen } from '@testing-library/react';
import { manuscriptStatus, ManuscriptStatus } from '@asap-hub/model';
import {
  info100,
  info500,
  success100,
  success500,
  warning100,
  warning500,
} from '../../colors';
import StatusBadge from '../StatusBadge';

// Replicate getStatusType logic locally in test
const getExpectedStyleType = (status: ManuscriptStatus) => {
  switch (status) {
    case 'Waiting for Report':
    case 'Manuscript Resubmitted':
      return 'warning';
    case 'Compliant':
    case 'Closed (other)':
      return 'final';
    case 'Review Compliance Report':
    case 'Submit Final Publication':
    case 'Addendum Required':
      return 'default';
    default:
      return 'none';
  }
};

const styleMap = {
  warning: {
    backgroundColor: warning100.rgba,
    textColor: warning500.rgba,
  },
  final: {
    backgroundColor: success100.rgba,
    textColor: success500.rgba,
  },
  default: {
    backgroundColor: info100.rgba,
    textColor: info500.rgba,
  },
  none: {
    backgroundColor: info100.rgba,
    textColor: info500.rgba,
  },
} as const;

describe('StatusBadge', () => {
  it.each(manuscriptStatus)(
    'renders correct style and label for status "%s"',
    (status) => {
      render(<StatusBadge status={status} />);

      const badge = screen.getByText(status);
      expect(badge).toBeInTheDocument();

      const type = getExpectedStyleType(status);
      const { backgroundColor, textColor } = styleMap[type];

      expect(badge).toHaveStyle(`background-color: ${backgroundColor}`);
      expect(badge).toHaveStyle(`color: ${textColor}`);
    },
  );

  it('includes status icon for "Compliant"', () => {
    render(<StatusBadge status="Compliant" />);
    const badge = screen.getByText('Compliant');
    const svg = badge.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not render icon for "Review Compliance Report" (default type)', () => {
    render(<StatusBadge status="Review Compliance Report" />);
    const badge = screen.getByText('Review Compliance Report');
    const svg = badge.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });
});
