import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { silver, fern } from '../../colors';
import { orcidIcon } from '../../icons';

import Button from '../Button';

it('renders a button with an icon and text', () => {
  const { getByRole } = render(
    <Button>
      {orcidIcon}
      Text
    </Button>,
  );
  expect(getByRole('button')).toContainHTML('<svg');
  expect(getByRole('button')).toHaveTextContent('Text');
});

it('renders a button with text only with increased horizontal padding', () => {
  const { getByRole, rerender } = render(<Button>{orcidIcon}Text</Button>);
  const normalPaddingLeft = Number(
    getComputedStyle(getByRole('button')).paddingLeft.replace(/em$/, ''),
  );

  rerender(<Button>Text</Button>);
  const textOnlyPaddingLeft = Number(
    getComputedStyle(getByRole('button')).paddingLeft.replace(/em$/, ''),
  );

  expect(textOnlyPaddingLeft).toBeGreaterThan(normalPaddingLeft);
});

it('renders a button with an icon only with decreased horizontal padding', () => {
  const { getByRole, rerender } = render(<Button>{orcidIcon}Text</Button>);
  const normalPaddingLeft = Number(
    getComputedStyle(getByRole('button')).paddingLeft.replace(/em$/, ''),
  );

  rerender(<Button>{orcidIcon}</Button>);
  const iconOnlyPaddingLeft = Number(
    getComputedStyle(getByRole('button')).paddingLeft.replace(/em$/, ''),
  );

  expect(iconOnlyPaddingLeft).toBeLessThan(normalPaddingLeft);
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
  expect((getByRole('button') as HTMLButtonElement).disabled).toBeFalsy();
  expect(getComputedStyle(getByRole('button')).backgroundColor).not.toBe(
    silver.rgb,
  );

  rerender(<Button enabled={false} />);
  expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
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

it('forwards the onClick event handler', () => {
  const clickHandler = jest.fn();
  const { getByRole } = render(<Button onClick={clickHandler} />);
  const button = getByRole('button');

  fireEvent.click(button);
  expect(clickHandler).toHaveBeenCalled();
});
