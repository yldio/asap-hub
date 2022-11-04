import { render } from '@testing-library/react';

import Card from '../Card';

it('renders the text in a <p>', () => {
  const { container } = render(<Card>text</Card>);
  expect(container.textContent).toBe('text');
});

it('applies a default border and paper background', () => {
  const { container } = render(<Card>text</Card>);

  expect(container.firstElementChild).toBeDefined();
  const { borderColor, backgroundColor } = getComputedStyle(
    container.firstElementChild as Element,
  );

  expect(borderColor).toMatchInlineSnapshot(`"rgb(223, 229, 234)"`);
  expect(backgroundColor).toMatchInlineSnapshot(`"rgb(255, 255, 255)"`);
});

it('applies a ember border and rose background', () => {
  const { container } = render(<Card accent="red">text</Card>);

  expect(container.firstElementChild).toBeDefined();
  const { borderColor, backgroundColor } = getComputedStyle(
    container.firstElementChild as Element,
  );

  expect(borderColor).toMatchInlineSnapshot(`"rgb(205, 20, 38)"`);
  expect(backgroundColor).toMatchInlineSnapshot(`"rgb(247, 232, 234)"`);
});

it('omits the padding if requested', () => {
  const { getByText, rerender } = render(<Card>text</Card>);
  expect(getByText('text')).toHaveStyleRule('padding-top', /px/);

  rerender(<Card padding={false}>text</Card>);
  expect(getByText('text')).not.toHaveStyleRule('padding-top', /.*/);
});

it('omits the shadow if requested', () => {
  const { getByText, rerender } = render(<Card>text</Card>);
  expect(getByText('text')).toHaveStyleRule('box-shadow', /px/);

  rerender(<Card noShadow>text</Card>);
  expect(getByText('text')).toHaveStyleRule('box-shadow', 'none');
});
