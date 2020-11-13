import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TextArea from '../TextArea';
import { ember, fern } from '../../colors';

it('renders a text area, passing through props', () => {
  const { getByRole } = render(<TextArea value="val" />);
  expect(getByRole('textbox')).toHaveValue('val');
});

it('emits value changes', async () => {
  const handleChange = jest.fn();
  const { getByRole } = render(
    <TextArea value="val" onChange={handleChange} />,
  );

  await userEvent.type(getByRole('textbox'), '123', { allAtOnce: true });
  expect(handleChange).toHaveBeenLastCalledWith('val123');
});

describe('when invalid', () => {
  it('shows a validation error message only after losing focus', () => {
    const { getByRole, getByText, queryByText } = render(
      <TextArea value="" required />,
    );
    expect(queryByText(/fill/i)).not.toBeInTheDocument();

    fireEvent.blur(getByRole('textbox'));
    expect(getByText(/fill/i)).toBeVisible();
    expect(getComputedStyle(getByText(/fill/i)).color).toBe(ember.rgb);
  });

  it('shows a custom validation message', () => {
    const { getByRole, getByText } = render(
      <TextArea value="wrong" customValidationMessage="Wrong!" />,
    );
    fireEvent.blur(getByRole('textbox'));
    expect(getByText('Wrong!')).toBeVisible();
    expect(getComputedStyle(getByText('Wrong!')).color).toBe(ember.rgb);
  });
});

describe('with a max length', () => {
  it('indicates how full it is', () => {
    const { getByText } = render(<TextArea value="val" maxLength={10} />);
    const indicator = getByText('10', { exact: false });
    expect(indicator.textContent).toMatchInlineSnapshot(`"3/10"`);
  });

  describe('that has not been reached', () => {
    it('indicates how full it is in green', () => {
      const { getByText } = render(<TextArea value="val" maxLength={10} />);
      const indicator = getByText('10', { exact: false });
      expect(getComputedStyle(indicator).color).toBe(fern.rgb);
    });
  });

  describe('that has been reached', () => {
    it('indicates how full it is in red', () => {
      const { getByText } = render(
        <TextArea value="val" maxLength={'val'.length} />,
      );
      const indicator = getByText(String('val'.length), { exact: false });
      expect(getComputedStyle(indicator).color).toBe(ember.rgb);
    });

    it('states that it is full', () => {
      const { getByText } = render(
        <TextArea value="val" maxLength={'val'.length} />,
      );
      expect(getByText(/reached/i)).toBeVisible();
    });
  });
});
