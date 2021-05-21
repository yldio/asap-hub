import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import LabeledPasswordField from '../LabeledPasswordField';
import { ember } from '../../colors';

it('renderes a labeled password field', () => {
  const { getByLabelText } = render(
    <LabeledPasswordField title="PW" forgotPasswordHref="#" value="" />,
  );

  expect(getByLabelText(/^PW/)).toHaveAttribute('type', 'password');
});

it('passes through the value', () => {
  const { getByLabelText } = render(
    <LabeledPasswordField title="PW" forgotPasswordHref="#" value="val" />,
  );
  expect(getByLabelText(/^PW/)).toHaveValue('val');
});

it('defaults the title to "Password"', () => {
  const { queryByLabelText } = render(
    <LabeledPasswordField forgotPasswordHref="#" value="" />,
  );
  expect(queryByLabelText(/^Password/)).toBeVisible();
});

it('renders a forgot password link with the given href', () => {
  const { getByText } = render(
    <LabeledPasswordField forgotPasswordHref="#forgotpassword" value="" />,
  );
  const link = getByText(/forgot.+password/i);

  expect(link.nodeName).toBe('A');
  expect(link).toHaveAttribute('href', '#forgotpassword');
});

it('renders a button to show the password', () => {
  const { getByTitle, getByRole } = render(
    <LabeledPasswordField forgotPasswordHref="#" value="val" />,
  );
  expect(getByRole('button')).toContainElement(getByTitle(/show/i));
});

it('does not render a button to show the password if empty', () => {
  const { queryByRole } = render(
    <LabeledPasswordField forgotPasswordHref="#" value="" />,
  );
  expect(queryByRole('button')).not.toBeInTheDocument();
});

it('changes the show password button color to red when invalid', () => {
  const { getByTitle, getByLabelText, rerender } = render(
    <LabeledPasswordField title="PW" forgotPasswordHref="#" value="val" />,
  );

  expect(
    findParentWithStyle(getByTitle(/show/i), 'fill')?.fill.replace(/ /g, ''),
  ).not.toBe(ember.rgb.replace(/ /g, ''));

  rerender(
    <LabeledPasswordField
      title="PW"
      forgotPasswordHref="#"
      value="val"
      customValidationMessage="Wrong!"
    />,
  );
  fireEvent.blur(getByLabelText(/^PW/));

  expect(
    findParentWithStyle(getByTitle(/show/i), 'fill')?.fill.replace(/ /g, ''),
  ).toBe(ember.rgb.replace(/ /g, ''));
});

describe('when showing the password', () => {
  it('renders a labeled text field', () => {
    const { getByRole, getByLabelText } = render(
      <LabeledPasswordField title="PW" forgotPasswordHref="#" value="val" />,
    );
    userEvent.click(getByRole('button'));
    expect(getByLabelText(/^PW/)).toHaveAttribute('type', 'text');
  });

  it('renders a button to hide the password', () => {
    const { getByTitle, getByRole } = render(
      <LabeledPasswordField title="PW" forgotPasswordHref="#" value="val" />,
    );
    userEvent.click(getByRole('button'));
    expect(getByRole('button')).toContainElement(getByTitle(/hide/i));
  });

  describe('and hiding it again', () => {
    it('renders a labeled password field', () => {
      const { getByRole, getByLabelText } = render(
        <LabeledPasswordField title="PW" forgotPasswordHref="#" value="val" />,
      );
      userEvent.click(getByRole('button'));
      userEvent.click(getByRole('button'));
      expect(getByLabelText(/^PW/)).toHaveAttribute('type', 'password');
    });
  });
});
