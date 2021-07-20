import { render, fireEvent } from '@testing-library/react';

import TextField from '../TextField';
import { silver } from '../../colors';
import { perRem } from '../../pixels';
import { indicatorPadding } from '../../form';

it('renders an input field, passing through props', () => {
  const { getByRole } = render(<TextField value="val" />);
  expect(getByRole('textbox')).toHaveValue('val');
});

it('emits value changes', () => {
  const handleChange = jest.fn();
  const { getByRole } = render(
    <TextField value="val" onChange={handleChange} />,
  );

  fireEvent.change(getByRole('textbox'), { target: { value: 'val123' } });
  expect(handleChange).toHaveBeenLastCalledWith('val123');
});

it('renders a disabled input field', () => {
  const { getByRole, rerender } = render(<TextField value="" />);
  expect((getByRole('textbox') as HTMLInputElement).disabled).toBeFalsy();
  expect(getComputedStyle(getByRole('textbox')).backgroundColor).not.toBe(
    silver.rgb,
  );

  rerender(<TextField value="" enabled={false} />);
  expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
  expect(getComputedStyle(getByRole('textbox')).backgroundColor).toBe(
    silver.rgb,
  );
});

it('with the label indicator prop prop shows a react node', () => {
  const { getByText } = render(
    <TextField value="" labelIndicator={'github.com/'} />,
  );
  expect(getByText(/github/)).toBeVisible();
});

describe('with a right indicator', () => {
  it('shows the indicator', () => {
    const { getByRole } = render(
      <TextField
        value=""
        rightIndicator={<svg role="img" viewBox="0 0 2 1" />}
      />,
    );
    const { width, height } = getComputedStyle(getByRole('img').parentElement!);
    expect(
      Number(width.replace(/em$/, '')) / Number(height.replace(/em$/, '')),
    ).toBeCloseTo(2);
  });

  it('pads the field to make space for the indicator', () => {
    const { getByRole, rerender } = render(<TextField value="" />);
    const normalPaddingRight = Number(
      getComputedStyle(getByRole('textbox')).paddingRight.replace(/em$/, ''),
    );

    rerender(
      <TextField
        value=""
        rightIndicator={<svg role="img" viewBox="0 0 2 1" />}
      />,
    );
    const customIndicatorPaddingRight = Number(
      getComputedStyle(getByRole('textbox')).paddingRight.replace(/em$/, ''),
    );
    const indicatorWidth = Number(
      getComputedStyle(getByRole('img').parentElement!).width.replace(
        /em$/,
        '',
      ),
    );

    expect(customIndicatorPaddingRight).toBeCloseTo(
      normalPaddingRight + indicatorWidth + indicatorPadding / perRem,
    );
  });
});

describe('with a left indicator', () => {
  it('shows the indicator', () => {
    const { getByRole } = render(
      <TextField
        value=""
        leftIndicator={<svg role="img" viewBox="0 0 2 1" />}
      />,
    );
    const { width, height } = getComputedStyle(getByRole('img').parentElement!);
    expect(
      Number(width.replace(/em$/, '')) / Number(height.replace(/em$/, '')),
    ).toBeCloseTo(2);
  });

  it('pads the field to make space for the indicator', () => {
    const { getByRole, rerender } = render(<TextField value="" />);
    const normalPaddingLeft = Number(
      getComputedStyle(getByRole('textbox')).paddingLeft.replace(/em$/, ''),
    );

    rerender(
      <TextField
        value=""
        leftIndicator={<svg role="img" viewBox="0 0 2 1" />}
      />,
    );
    const customIndicatorPaddingLeft = Number(
      getComputedStyle(getByRole('textbox')).paddingLeft.replace(/em$/, ''),
    );
    const indicatorWidth = Number(
      getComputedStyle(getByRole('img').parentElement!).width.replace(
        /em$/,
        '',
      ),
    );

    expect(customIndicatorPaddingLeft).toBeCloseTo(
      normalPaddingLeft + indicatorWidth + indicatorPadding / perRem,
    );
  });
});
