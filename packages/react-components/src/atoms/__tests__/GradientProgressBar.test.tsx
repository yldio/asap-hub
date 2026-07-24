import { render } from '@testing-library/react';

import GradientProgressBar from '../GradientProgressBar';

describe('GradientProgressBar', () => {
  it('renders a progressbar with the given percentage', () => {
    const { getByRole } = render(<GradientProgressBar percentage={65} />);
    const bar = getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '65');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('sets the fill width from the percentage', () => {
    const { getByRole } = render(<GradientProgressBar percentage={65} />);
    const fill = getByRole('progressbar').firstElementChild;
    expect(fill).toHaveStyle('width: 65%');
  });

  it('clamps out-of-range percentages to 0–100', () => {
    const { getByRole, rerender } = render(
      <GradientProgressBar percentage={150} />,
    );
    expect(getByRole('progressbar').firstElementChild).toHaveStyle(
      'width: 100%',
    );

    rerender(<GradientProgressBar percentage={-20} />);
    expect(getByRole('progressbar').firstElementChild).toHaveStyle('width: 0%');
  });
});
