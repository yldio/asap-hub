import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { silver, fern, charcoal } from '../../colors';
import { orcidIcon } from '../../icons';
import { activePrimaryBackgroundColor } from '../../button';

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

it('renders an active secondary button', () => {
  const { getByRole, rerender } = render(<Button />);
  expect(getComputedStyle(getByRole('button')).borderColor).not.toBe(
    charcoal.rgb.replace(/ /g, ''),
  );

  rerender(<Button active />);
  expect(getComputedStyle(getByRole('button')).borderColor).toBe(
    charcoal.rgb.replace(/ /g, ''),
  );
});

it('renders an active primary button', () => {
  const { getByRole, rerender } = render(<Button primary />);
  expect(getComputedStyle(getByRole('button')).backgroundColor).not.toBe(
    activePrimaryBackgroundColor.rgba,
  );

  rerender(<Button primary active />);
  expect(getComputedStyle(getByRole('button')).backgroundColor).toBe(
    activePrimaryBackgroundColor.rgba,
  );
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
  const normalPaddingTop = Number(
    getComputedStyle(getByRole('button')).paddingTop.replace(/em$/, ''),
  );

  rerender(<Button small />);
  const smallPaddingTop = Number(
    getComputedStyle(getByRole('button')).paddingTop.replace(/em$/, ''),
  );

  expect(smallPaddingTop).toBeLessThan(normalPaddingTop);
});

describe('the type', () => {
  it('is button by default', () => {
    const { getByRole } = render(<Button />);
    expect(getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('is submit for a primary button', () => {
    const { getByRole } = render(<Button primary />);
    expect(getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('is submit if set explicitly', () => {
    const { getByRole } = render(<Button submit />);
    expect(getByRole('button')).toHaveAttribute('type', 'submit');
  });
});

it('renders a link-styled button', () => {
  const { getByRole } = render(<Button linkStyle />);
  const { color, padding } = getComputedStyle(getByRole('button'));
  expect(color).toBe(fern.rgb);
  expect(padding).toMatchInlineSnapshot(`"0px"`);
});

it('forwards the onClick event handler', () => {
  const clickHandler = jest.fn();
  const { getByRole } = render(<Button onClick={clickHandler} />);
  const button = getByRole('button');

  fireEvent.click(button);
  expect(clickHandler).toHaveBeenCalled();
});
