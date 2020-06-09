import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';

import TextField from '../TextField';
import { silver, ember } from '../../colors';

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

it('with the loading prop shows a loading indicator', () => {
  const { getByRole } = render(<TextField value="" loading />);
  expect(getComputedStyle(getByRole('textbox')).backgroundImage).toMatch(
    /^url\(.*loading.*\.gif.*\)$/,
  );
});

describe('when valid', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('does not by default show an indicator', () => {
    const { getByRole } = render(<TextField value="" />);
    expect(getComputedStyle(getByRole('textbox')).backgroundImage).toBe('');
  });

  describe('when a validation prop is set', () => {
    it('shows an indicator', () => {
      const { getByRole } = render(<TextField value="" pattern=".*" />);
      expect(getComputedStyle(getByRole('textbox')).backgroundImage).toMatch(
        /^url\(.*tick.*\.gif.*\)$/,
      );
    });

    it('removes the indicator while the value is changing', () => {
      const { getByRole, rerender } = render(
        <TextField value="val" pattern=".*" />,
      );
      rerender(<TextField value="changed" pattern=".*" />);
      expect(getComputedStyle(getByRole('textbox')).backgroundImage).toBe('');
    });

    it('shows an indicator again with a new animation after a second without changes', () => {
      const { getByRole, rerender } = render(
        <TextField value="val" pattern=".*" />,
      );
      const [, oldFragment] = getComputedStyle(
        getByRole('textbox'),
      ).backgroundImage.match(/^url\(.*tick.*\.gif#(.*)\)$/)!;

      rerender(<TextField value="changed" pattern=".*" />);
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      const [, newFragment] = getComputedStyle(
        getByRole('textbox'),
      ).backgroundImage.match(/^url\(.*tick.*\.gif#(.*)\)$/)!;

      expect(newFragment).not.toEqual(oldFragment);
    });
  });

  describe('with the indicateValid prop', () => {
    it('shows an indicator', () => {
      const { getByRole } = render(<TextField value="" indicateValid />);
      expect(getComputedStyle(getByRole('textbox')).backgroundImage).toMatch(
        /^url\(.*tick.*\.gif.*\)$/,
      );
    });
  });
});

describe('when invalid', () => {
  it('does not immediately show a validation error message ', () => {
    const { queryByText } = render(<TextField value="wrong" pattern="^val$" />);
    expect(queryByText(/match/i)).not.toBeInTheDocument();
  });

  it('shows a validation error message after losing focus', () => {
    const { getByRole, getByText } = render(
      <TextField value="wrong" pattern="^val$" />,
    );
    fireEvent.blur(getByRole('textbox'));
    expect(getByText(/match/i)).toBeVisible();
    expect(getComputedStyle(getByText(/match/i)).color).toBe(ember.rgb);
  });

  it('shows a validation error message when the form is validated', () => {
    const { getByRole, getByText } = render(
      <form>
        <TextField value="wrong" pattern="^val$" />
      </form>,
    );
    (getByRole('textbox') as HTMLInputElement).form!.reportValidity();
    expect(getByText(/match/i)).toBeVisible();
  });

  it('shows a custom validation message', () => {
    const { getByRole, getByText } = render(
      <TextField value="wrong" customValidationMessage="Wrong!" />,
    );
    fireEvent.blur(getByRole('textbox'));
    expect(getByText('Wrong!')).toBeVisible();
    expect(getComputedStyle(getByText('Wrong!')).color).toBe(ember.rgb);
  });

  it('updates the custom validation message without a revalidation', () => {
    const { getByRole, getByText, rerender } = render(
      <TextField value="wrong" customValidationMessage="Wrong!" />,
    );
    fireEvent.blur(getByRole('textbox'));
    rerender(<TextField value="wrong" customValidationMessage="Almost!" />);
    expect(getByText('Almost!')).toBeVisible();
  });
});
