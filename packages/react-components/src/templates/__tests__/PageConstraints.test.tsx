import { render } from '@testing-library/react';

import PageConstraints from '../PageConstraints';

it('renders children', () => {
  const { getByText } = render(<PageConstraints>Test Content</PageConstraints>);
  expect(getByText('Test Content')).toBeVisible();
});

it('renders as div by default', () => {
  const { container } = render(<PageConstraints>Test Content</PageConstraints>);
  expect(container.firstChild?.nodeName).toBe('DIV');
});

it('renders as specified element', () => {
  const { container } = render(
    <PageConstraints as="header">Test Content</PageConstraints>,
  );
  expect(container.firstChild?.nodeName).toBe('HEADER');
});

it('renders as main element', () => {
  const { container } = render(
    <PageConstraints as="main">Test Content</PageConstraints>,
  );
  expect(container.firstChild?.nodeName).toBe('MAIN');
});

it('renders as article element', () => {
  const { container } = render(
    <PageConstraints as="article">Test Content</PageConstraints>,
  );
  expect(container.firstChild?.nodeName).toBe('ARTICLE');
});

it('applies container styles by default', () => {
  const { container } = render(<PageConstraints>Test Content</PageConstraints>);
  const element = container.firstChild as HTMLElement;
  const styles = window.getComputedStyle(element);
  expect(styles.display).toBe('flex');
  expect(styles.flexFlow).toBe('column');
});

it('wraps content in constrained container div', () => {
  const { container, getByText } = render(
    <PageConstraints>Test Content</PageConstraints>,
  );
  const innerDiv = container.querySelector('div > div') as HTMLElement;
  expect(innerDiv).toBeInTheDocument();
  expect(innerDiv).toContainElement(getByText('Test Content'));
});
