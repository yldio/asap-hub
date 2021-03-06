import { render, fireEvent } from '@testing-library/react';

import TextArea from '../TextArea';
import { ember, fern, silver } from '../../colors';

it('renders a text area, passing through props', () => {
  const { getByRole } = render(<TextArea value="val" />);
  expect(getByRole('textbox')).toHaveValue('val');
});

it('emits value changes', async () => {
  const handleChange = jest.fn();
  const { getByRole } = render(
    <TextArea value="val" onChange={handleChange} />,
  );

  fireEvent.change(getByRole('textbox'), { target: { value: 'val123' } });
  expect(handleChange).toHaveBeenLastCalledWith('val123');
});

it('renders a disabled text area', () => {
  const { getByRole, rerender } = render(<TextArea value="val" />);
  expect((getByRole('textbox') as HTMLInputElement).disabled).toBeFalsy();
  expect(getComputedStyle(getByRole('textbox')).backgroundColor).not.toBe(
    silver.rgb,
  );

  rerender(<TextArea value="val" enabled={false} />);
  expect((getByRole('textbox') as HTMLInputElement).disabled).toBe(true);
  expect(getComputedStyle(getByRole('textbox')).backgroundColor).toBe(
    silver.rgb,
  );
});

describe('when invalid', () => {
  it('shows a validation error message only after losing focus', async () => {
    const { getByRole, findByText, queryByText } = render(
      <TextArea value="" required />,
    );
    expect(queryByText(/fill/i)).not.toBeInTheDocument();

    fireEvent.focusOut(getByRole('textbox'));
    expect(await findByText(/fill/i)).toBeVisible();
    expect(getComputedStyle(await findByText(/fill/i)).color).toBe(ember.rgb);
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
