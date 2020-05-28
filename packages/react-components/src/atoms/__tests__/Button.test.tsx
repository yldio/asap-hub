import React from 'react';
import { render } from '@testing-library/react';

import { silver, fern } from '../../colors';

import Button from '../Button';

it('renders a button with text', () => {
  const { getByRole } = render(<Button>Text</Button>);
  expect(getByRole('button')).toHaveTextContent('Text');
});

it('renders a primary button', () => {
  const { getByRole, rerender } = render(<Button />);
  expect(getComputedStyle(getByRole('button')).backgroundColor).not.toBe(
    fern.rgb,
  );

  rerender(<Button primary />);
  expect(getComputedStyle(getByRole('button')).backgroundColor).toBe(fern.rgb);
});

it('renders a disabled button', () => {
  const { getByRole, rerender } = render(<Button />);
  expect(getComputedStyle(getByRole('button')).backgroundColor).not.toBe(
    silver.rgb,
  );

  rerender(<Button enabled={false} />);
  expect(getComputedStyle(getByRole('button')).backgroundColor).toBe(
    silver.rgb,
  );
});

it('renders a small button', () => {
  const { getByRole, rerender } = render(<Button />);
  const normalHeight = Number(
    getComputedStyle(getByRole('button')).height.replace(/em$/, ''),
  );

  rerender(<Button small />);
  const smallHeight = Number(
    getComputedStyle(getByRole('button')).height.replace(/em$/, ''),
  );

  expect(smallHeight).toBeLessThan(normalHeight);
});
