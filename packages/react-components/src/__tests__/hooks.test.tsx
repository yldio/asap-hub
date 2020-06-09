import React from 'react';
import { render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

import { useInput, useGifReplay } from '../hooks';

describe('useInput', () => {
  const Input = () => {
    const [inputProps] = useInput<string>('text');
    return <input {...inputProps} type="text" />;
  };

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

describe('useGifReplay', () => {
  it('returns the same GIF URL apart from the fragment', () => {
    const {
      result: { current },
    } = renderHook(() => useGifReplay('/meme.gif', []));
    expect(new URL(current, window.location.href).pathname).toEqual(
      '/meme.gif',
    );
  });

  it('changes the fragment when the dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ counter }) => useGifReplay('/meme.gif', [counter]),
      { initialProps: { counter: 1 } },
    );
    const oldFragment = new URL(result.current, window.location.href).hash;

    rerender({ counter: 2 });
    const newFragment = new URL(result.current, window.location.href).hash;

    expect(newFragment).not.toEqual(oldFragment);
  });

  it('does not change fragment when the dependencies remain unchanged', () => {
    const { result, rerender } = renderHook(
      ({ counter }) => useGifReplay('/meme.gif', [counter]),
      { initialProps: { counter: 1 } },
    );
    const oldFragment = new URL(result.current, window.location.href).hash;

    rerender({ counter: 1 });
    const newFragment = new URL(result.current, window.location.href).hash;

    expect(newFragment).toEqual(oldFragment);
  });
});
