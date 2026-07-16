import { render, screen } from '@testing-library/react';

import Spinner from '../Spinner';

describe('Spinner', () => {
  test('Should render an accessible progressbar with the default label', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'loading');
  });

  test('Should apply a custom aria-label and test id', () => {
    render(<Spinner ariaLabel="Saving avatar" testId="my-spinner" />);
    const spinner = screen.getByTestId('my-spinner');
    expect(spinner).toHaveAttribute('aria-label', 'Saving avatar');
  });

  test('Should set aria-busy when ariaBusy is passed', () => {
    render(<Spinner ariaBusy />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-busy',
      'true',
    );
  });

  test('Should apply size, thickness and colors', () => {
    render(
      <Spinner
        size={16}
        thickness={2}
        color="rgb(255, 0, 0)"
        trackColor="rgb(0, 0, 255)"
      />,
    );
    const styles = window.getComputedStyle(screen.getByRole('progressbar'));
    expect(styles.borderTopColor).toBe('rgb(255, 0, 0)');
    expect(styles.borderRightColor).toBe('rgb(0, 0, 255)');
  });

  test('Should color the right border when arc is set', () => {
    render(<Spinner color="rgb(255, 0, 0)" arc />);
    const styles = window.getComputedStyle(screen.getByRole('progressbar'));
    expect(styles.borderRightColor).toBe('rgb(255, 0, 0)');
  });

  test('Should honour a custom animation speed', () => {
    render(<Spinner speed="0.8s" />);
    const styles = window.getComputedStyle(screen.getByRole('progressbar'));
    expect(styles.animation).toContain('0.8s');
  });

  test('Should forward a className', () => {
    render(<Spinner className="extra" />);
    expect(screen.getByRole('progressbar')).toHaveClass('extra');
  });
});
