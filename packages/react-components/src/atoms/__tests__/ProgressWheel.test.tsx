import { render } from '@testing-library/react';

import ProgressWheel from '../ProgressWheel';

describe('ProgressWheel', () => {
  it('renders a progressbar with the given percentage', () => {
    const { getByRole } = render(<ProgressWheel percentage={40} />);
    const wheel = getByRole('progressbar');
    expect(wheel).toHaveAttribute('aria-valuenow', '40');
    expect(wheel).toHaveAttribute('aria-valuemin', '0');
    expect(wheel).toHaveAttribute('aria-valuemax', '100');
  });

  it('sets the progress arc dashoffset from the percentage', () => {
    const { getByRole } = render(
      <ProgressWheel percentage={25} size={74} strokeWidth={9} />,
    );
    const radius = (74 - 9) / 2;
    const circumference = 2 * Math.PI * radius;
    const expectedOffset = circumference * (1 - 25 / 100);
    const arc = getByRole('progressbar').querySelectorAll('circle')[1];
    expect(arc).toHaveAttribute('stroke-dashoffset', `${expectedOffset}`);
    expect(arc).toHaveAttribute('stroke-dasharray', `${circumference}`);
  });

  it('clamps out-of-range percentages to 0–100', () => {
    const { getByRole, rerender } = render(<ProgressWheel percentage={150} />);
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    rerender(<ProgressWheel percentage={-20} />);
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
});
