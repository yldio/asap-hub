import React from 'react';
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

  expect(borderColor).toMatchInlineSnapshot(`"rgb(237,241,243)"`);
  expect(backgroundColor).toMatchInlineSnapshot(`"rgb(255, 255, 255)"`);
});

it('applies a ember border and rose background', () => {
  const { container } = render(<Card accent="red">text</Card>);

  expect(container.firstElementChild).toBeDefined();
  const { borderColor, backgroundColor } = getComputedStyle(
    container.firstElementChild as Element,
  );

  expect(borderColor).toMatchInlineSnapshot(`"rgb(205,20,38)"`);
  expect(backgroundColor).toMatchInlineSnapshot(`"rgb(247, 232, 234)"`);
});

it('Renders a div with min padding', () => {
  const { container } = render(<Card minPadding>text</Card>);
  expect(container.textContent).toBe('text');
});
