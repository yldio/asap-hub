import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Toast, { getIcon } from '../Toast';
import { noop } from '../../utils';
import { errorIcon, infoCircleYellow } from '../../icons';

it('renders the children and default icon', () => {
  const { getByText, getByTitle } = render(<Toast>error message</Toast>);
  expect(getByText('error message')).toBeVisible();
  expect(getByTitle('Error Icon')).toBeInTheDocument();
});

it('renders with the info accent', () => {
  const { getByText, getByTitle } = render(
    <Toast accent="info">info message</Toast>,
  );
  expect(getByText('info message')).toBeVisible();
  expect(getByTitle('Info Circle Yellow')).toBeInTheDocument();
});

it('does not render a close button by default', () => {
  const { queryByText } = render(<Toast>error message</Toast>);
  expect(queryByText(/close/i)).not.toBeInTheDocument();
});
describe('when closable', () => {
  it('renders a close button', () => {
    const { getByTitle } = render(<Toast onClose={noop}>error message</Toast>);
    expect(getByTitle(/close/i)).toBeInTheDocument();
  });

  it('emits close events', () => {
    const handleClose = jest.fn();
    const { getByTitle } = render(
      <Toast onClose={handleClose}>error message</Toast>,
    );

    userEvent.click(getByTitle(/close/i));
    expect(handleClose).toHaveBeenCalled();
  });
});

it('renders the correct icon', () => {
  expect(getIcon('info')).toBe(infoCircleYellow);
  expect(getIcon('alert')).toBe(errorIcon);
});
