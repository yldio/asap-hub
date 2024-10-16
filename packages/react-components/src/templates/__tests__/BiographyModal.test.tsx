import { ReactNode } from 'react';
import { StaticRouter } from 'react-router-dom';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BiographyModal from '../BiographyModal';

const renderModal = (children: ReactNode) =>
  render(<StaticRouter>{children}</StaticRouter>);

it('renders a form to edit the biography', () => {
  const { getByRole } = renderModal(<BiographyModal backHref="#" />);
  expect(getByRole('heading')).toHaveTextContent(/bio/i);
});

it('renders a text field containing the biography, marked as mandatory', () => {
  const { getByDisplayValue, container } = renderModal(
    <BiographyModal backHref="#" biography="My Bio" />,
  );
  expect(container.querySelector('label')?.textContent).toContain('required');
  expect(getByDisplayValue('My Bio')).toBeEnabled();
});

it('fires onSave when submitting', async () => {
  const handleSave = jest.fn();
  const { getByDisplayValue, getByText } = renderModal(
    <BiographyModal backHref="#" biography="My Bio" onSave={handleSave} />,
  );

  userEvent.type(getByDisplayValue('My Bio'), ' 2');
  userEvent.click(getByText(/save/i));
  expect(handleSave).toHaveBeenLastCalledWith('My Bio 2');

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
it('does not fire onSave when the bio is missing', () => {
  const handleSave = jest.fn();
  const { getByDisplayValue, getByText } = renderModal(
    <BiographyModal backHref="#" biography="My Bio" onSave={handleSave} />,
  );

  userEvent.clear(getByDisplayValue('My Bio'));
  userEvent.click(getByText(/save/i));
  expect(handleSave).not.toHaveBeenCalled();
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = renderModal(
    <BiographyModal backHref="#" biography="My Bio" onSave={handleSave} />,
  );

  userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
