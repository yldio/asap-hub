import { InputHTMLAttributes } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { useValidation } from '../form';
import { noop } from '../utils';

describe('useValidation', () => {
  type ValidatedInputProps = {
    customValidationMessage?: string;
  } & Pick<InputHTMLAttributes<HTMLInputElement>, 'value' | 'pattern'>;
  const ValidatedInput: React.FC<ValidatedInputProps> = ({
    customValidationMessage = '',
    ...props
  }) => {
    const { validationMessage, validationTargetProps } =
      useValidation<HTMLInputElement>(customValidationMessage);
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

  it('shows a validation error message when the form is validated', () => {
    const { getByRole, getByText } = render(
      <form>
        <ValidatedInput value="wrong" pattern="^val$" />
      </form>,
    );
    (getByRole('textbox') as HTMLInputElement).form!.reportValidity();
    expect(getByText(/match/i)).toBeVisible();
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
