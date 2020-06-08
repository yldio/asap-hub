import React from 'react';
import { render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import { useInput } from '../hooks';

const Input = () => {
  const [inputProps] = useInput<string>('text');
  return <input {...inputProps} type="text" />;
};

describe('useInput', () => {
  it('provides the initial value for an input field', () => {
    const { getByRole } = render(<Input />);

    expect(getByRole('textbox')).toHaveValue('text');
  });

  it('accepts input value updates', async () => {
    const { getByRole } = render(<Input />);

    await userEvent.type(getByRole('textbox'), '2');

    expect(getByRole('textbox')).toHaveValue('text2');
  });

  it('provides the initial value for programmatic consumption', () => {
    const [, value] = renderHook(() => useInput<string>('text')).result.current;

    expect(value).toBe('text');
  });

  it('accepts programmatic value updates', async () => {
    const { result } = renderHook(() => useInput<string>('text'));

    const [, , setValue] = result.current;
    act(() => setValue('text2'));
    const [, value] = result.current;

    expect(value).toBe('text2');
  });
});
