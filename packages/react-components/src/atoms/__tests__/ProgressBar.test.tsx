import { render } from '@testing-library/react';

import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders a progressbar with the given percentage', () => {
    const { getByRole } = render(<ProgressBar percentage={65} />);
    const bar = getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '65');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('sets the fill width from the percentage', () => {
    const { getByRole } = render(<ProgressBar percentage={65} />);
    const fill = getByRole('progressbar').firstElementChild;
    expect(fill).toHaveStyle('width: 65%');
  });

  it('clamps out-of-range percentages to 0–100', () => {
    const { getByRole, rerender } = render(<ProgressBar percentage={150} />);
    expect(getByRole('progressbar').firstElementChild).toHaveStyle(
      'width: 100%',
    );

    rerender(<ProgressBar percentage={-20} />);
    expect(getByRole('progressbar').firstElementChild).toHaveStyle('width: 0%');
  });
});
