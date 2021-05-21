import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ModalEditHeader from '../ModalEditHeader';

const props: ComponentProps<typeof ModalEditHeader> = {
  title: '',
  backHref: '',
};
it('renders the header', () => {
  const { getByRole } = render(
    <ModalEditHeader {...props} title="Edit Link" />,
  );
  expect(getByRole('heading').textContent).toEqual('Edit Link');
});

it('calls the save function', () => {
  const handleSave = jest.fn();
  const { getByText } = render(
    <ModalEditHeader {...props} onSave={handleSave} />,
  );
  userEvent.click(getByText(/save/i));
  expect(handleSave).toHaveBeenCalled();
});
it('disables the save button', () => {
  const { getByText } = render(
    <ModalEditHeader {...props} saveEnabled={false} />,
  );
  expect(getByText(/save/i).closest('button')).toBeDisabled();
});

it('displays the back link', () => {
  const { getByTitle } = render(
    <ModalEditHeader {...props} backHref="/back" />,
  );
  expect(getByTitle('Close').closest('a')).toHaveAttribute('href', '/back');
});
