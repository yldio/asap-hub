import { InputHTMLAttributes } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { useValidation } from '../form';
import { noop } from '../utils';

describe('useValidation', () => {
  type ValidatedInputProps = {
    customValidationMessage?: string;
    getValidationMessage?: Parameters<typeof useValidation>[1];
  } & Pick<InputHTMLAttributes<HTMLInputElement>, 'value' | 'pattern'>;
  const ValidatedInput: React.FC<ValidatedInputProps> = ({
    customValidationMessage = '',
    getValidationMessage,
    ...props
  }) => {
    const { validationMessage, validationTargetProps } =
      useValidation<HTMLInputElement>(
        customValidationMessage,
        getValidationMessage,
      );
    return (
      <label>
        <input
          {...props}
          {...validationTargetProps}
          type="text"
          onChange={noop}
        />
        {validationMessage}
      </label>
    );
  };

  it('does not immediately show a validation error message', () => {
    const { queryByText } = render(
      <ValidatedInput value="wrong" pattern="^val$" />,
    );
    expect(queryByText(/match/i)).not.toBeInTheDocument();
  });

  it('shows a validation error message after losing focus', async () => {
    const { getByRole, findByText } = render(
      <ValidatedInput value="wrong" pattern="^val$" />,
    );
    fireEvent.focusOut(getByRole('textbox'));
    expect(await findByText(/match/i)).toBeVisible();
  });

  it('shows a validation error message when the form is validated', async () => {
    const { getByRole, findByText } = render(
      <form>
        <ValidatedInput value="wrong" pattern="^val$" />
      </form>,
    );
    await waitFor(() => {
      (getByRole('textbox') as HTMLInputElement).form!.reportValidity();
    });
    expect(await findByText(/match/i)).toBeVisible();
  });

  it('does not immediately show a custom validation error message', () => {
    const { queryByText } = render(
      <ValidatedInput
        getValidationMessage={() => 'custom error message'}
        value="wrong"
        pattern="^val$"
      />,
    );
    expect(queryByText('custom error message')).not.toBeInTheDocument();
  });

  it('shows a custom validation error message after losing focus', async () => {
    const message = jest.fn(() => 'custom error message');
    const { getByRole, findByText } = render(
      <ValidatedInput
        getValidationMessage={message}
        value="wrong"
        pattern="^val$"
      />,
    );
    fireEvent.focusOut(getByRole('textbox'));
    expect(await findByText('custom error message')).toBeVisible();
    expect(message).toHaveBeenCalled();
  });

  it('shows a custom validation error message when the form is validated', async () => {
    const message = jest.fn(() => 'custom error message');
    const { getByRole, findByText } = render(
      <form>
        <ValidatedInput
          getValidationMessage={message}
          value="wrong"
          pattern="^val$"
        />
      </form>,
    );
    await waitFor(() => {
      (getByRole('textbox') as HTMLInputElement).form!.reportValidity();
    });
    expect(await findByText('custom error message')).toBeVisible();
    expect(message).toHaveBeenCalled();
  });

  it('shows a custom validation message', () => {
    const { getByRole, getByText } = render(
      <ValidatedInput value="wrong" customValidationMessage="Wrong!" />,
    );
    fireEvent.blur(getByRole('textbox'));
    expect(getByText('Wrong!')).toBeVisible();
  });

  it('updates the custom validation message without a revalidation', () => {
    const { getByRole, getByText, rerender } = render(
      <ValidatedInput value="wrong" customValidationMessage="Wrong!" />,
    );
    fireEvent.blur(getByRole('textbox'));
    rerender(
      <ValidatedInput value="wrong" customValidationMessage="Almost!" />,
    );
    expect(getByText('Almost!')).toBeVisible();
  });
});
