import { render } from '@testing-library/react';

import { rem } from '../../pixels';
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

  it('anchors the gradient to the track by default', () => {
    const { getByRole } = render(<GradientProgressBar percentage={50} />);
    const fill = getByRole('progressbar').firstElementChild;
    expect(fill).toHaveStyle('background-size: 200% 100%');
    expect(fill).toHaveStyle('height: 100%');
  });

  it('anchors the gradient to the fill and takes the given geometry', () => {
    const { getByRole } = render(
      <GradientProgressBar
        percentage={50}
        height={24}
        radius={999}
        gradient="linear-gradient(90deg, red 0%, blue 100%)"
        gradientAnchor="fill"
      />,
    );
    const bar = getByRole('progressbar');
    expect(bar).toHaveStyle(`height: ${rem(24)}`);
    expect(bar).toHaveStyle(`border-radius: ${rem(999)}`);
    const fill = bar.firstElementChild;
    expect(fill).not.toHaveStyle('background-size: 200% 100%');
    expect(fill).toHaveStyle(
      'background: linear-gradient(90deg, red 0%, blue 100%)',
    );
  });

  it('exposes the label as an accessible name', () => {
    const { getByRole } = render(
      <GradientProgressBar percentage={65} label="Preliminary findings" />,
    );
    expect(getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Preliminary findings',
    );
  });
});
