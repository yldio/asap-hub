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

  it('renders the grey track, coloured arc and two caps when there is progress', () => {
    const { getByRole } = render(<GradientProgressWheel percentage={40} />);
    expect(getByRole('progressbar').childElementCount).toBe(4);
  });

  it('renders only the grey track at 0%, so no colour shows', () => {
    const { getByRole } = render(<GradientProgressWheel percentage={0} />);
    expect(getByRole('progressbar').childElementCount).toBe(1);
  });

  it('exposes the label as an accessible name', () => {
    const { getByRole } = render(
      <GradientProgressWheel percentage={40} label="Attendance" />,
    );
    expect(getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Attendance',
    );
  });
});
