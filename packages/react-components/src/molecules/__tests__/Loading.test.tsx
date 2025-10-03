import { render } from '@testing-library/react';

import Loading from '../Loading';

it('renders loading component with spinner and text', () => {
  const { container } = render(<Loading />);
  expect(container).toHaveTextContent(/Loading\.\.\./i);
});

it('has centered layout container', () => {
  const { container } = render(<Loading />);
  const loadingContainer = container.firstChild as HTMLElement;
  expect(loadingContainer).toBeInTheDocument();
  const styles = window.getComputedStyle(loadingContainer);
  expect(styles.display).toBe('flex');
  expect(styles.justifyContent).toBe('center');
  expect(styles.alignItems).toBe('center');
});
