import { render } from '@testing-library/react';

import GradientProgressWheel from '../GradientProgressWheel';

describe('GradientProgressWheel', () => {
  it('renders a progressbar with the given percentage', () => {
    const { getByRole } = render(<GradientProgressWheel percentage={40} />);
    const wheel = getByRole('progressbar');
    expect(wheel).toHaveAttribute('aria-valuenow', '40');
    expect(wheel).toHaveAttribute('aria-valuemin', '0');
    expect(wheel).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders the ring plus two colour-matched caps when there is progress', () => {
    const { getByRole } = render(<GradientProgressWheel percentage={40} />);
    expect(getByRole('progressbar').childElementCount).toBe(3);
  });

  it('renders no caps at 0%', () => {
    const { getByRole } = render(<GradientProgressWheel percentage={0} />);
    expect(getByRole('progressbar').childElementCount).toBe(1);
  });

  it('clamps out-of-range percentages to 0–100', () => {
    const { getByRole, rerender } = render(
      <GradientProgressWheel percentage={150} />,
    );
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    rerender(<GradientProgressWheel percentage={-20} />);
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
});
