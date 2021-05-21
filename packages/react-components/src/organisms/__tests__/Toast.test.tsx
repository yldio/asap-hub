import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Toast from '../Toast';
import { noop } from '../../utils';

it('renders the children', () => {
  const { getByText } = render(<Toast>error message</Toast>);
  expect(getByText('error message')).toBeVisible();
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
