import { render } from '@testing-library/react';

import PageInfoContainer from '../PageInfoContainer';

it('renders children', () => {
  const { getByText } = render(
    <PageInfoContainer>Test Content</PageInfoContainer>,
  );
  expect(getByText('Test Content')).toBeVisible();
});

it('renders without navigation', () => {
  const { container } = render(
    <PageInfoContainer>Test Content</PageInfoContainer>,
  );
  expect(container.querySelector('div > div > div')).toBeInTheDocument();
});

it('renders with navigation', () => {
  const { getByText, getByRole } = render(
    <PageInfoContainer nav={<nav>Navigation Content</nav>}>
      Test Content
    </PageInfoContainer>,
  );
  expect(getByText('Test Content')).toBeVisible();
  expect(getByRole('navigation')).toBeInTheDocument();
  expect(getByText('Navigation Content')).toBeVisible();
});

it('renders breadcrumbs before the children when provided', () => {
  const { container, getByText } = render(
    <PageInfoContainer breadcrumbs={<span>Breadcrumb Content</span>}>
      <span>Test Content</span>
    </PageInfoContainer>,
  );
  expect(getByText('Breadcrumb Content')).toBeVisible();
  expect(container.textContent).toBe('Breadcrumb ContentTest Content');
});

it('does not render a breadcrumbs container when none is provided', () => {
  const { queryByText } = render(
    <PageInfoContainer>Test Content</PageInfoContainer>,
  );
  expect(queryByText('Breadcrumb Content')).not.toBeInTheDocument();
});

it('applies container styles', () => {
  const { container } = render(
    <PageInfoContainer>Test Content</PageInfoContainer>,
  );
  const outerDiv = container.firstChild as HTMLElement;
  const styles = window.getComputedStyle(outerDiv);

  // PageConstraints applies display: flex
  expect(styles.display).toBe('flex');
});

it('applies noPaddingBottom when nav is provided', () => {
  const { container } = render(
    <PageInfoContainer nav={<nav>Nav</nav>}>Test Content</PageInfoContainer>,
  );
  const outerDiv = container.firstChild as HTMLElement;
  const styles = window.getComputedStyle(outerDiv);

  // When nav is present, noPaddingBottom should be applied
  expect(styles.paddingBottom).toBe('0px');
});

it('does not apply noPaddingBottom when nav is not provided', () => {
  const { container } = render(
    <PageInfoContainer>Test Content</PageInfoContainer>,
  );
  const outerDiv = container.firstChild as HTMLElement;
  const styles = window.getComputedStyle(outerDiv);

  // Without nav, padding bottom should be present (default padding from PageConstraints)
  expect(styles.paddingBottom).not.toBe('0px');
});
