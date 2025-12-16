import { ReactNode } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BiographyModal from '../BiographyModal';

const renderModal = (children: ReactNode) =>
  render(<StaticRouter location="/">{children}</StaticRouter>);

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

it.skip('fires onSave when submitting', async () => {
  // Suppress expected react-router warning about navigate() being called outside useEffect
  // TODO: Check if this should be here or if the test requires a refactor
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  const handleSave = jest.fn();
  const { getByDisplayValue, getByText } = renderModal(
    <BiographyModal backHref="#" biography="My Bio" onSave={handleSave} />,
  );

  await userEvent.type(getByDisplayValue('My Bio'), ' 2');
  await userEvent.click(getByText(/save/i));
  expect(handleSave).toHaveBeenLastCalledWith('My Bio 2');

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
  warnSpy.mockRestore();
});
it('does not fire onSave when the bio is missing', async () => {
  const handleSave = jest.fn();
  const { getByDisplayValue, getByText } = renderModal(
    <BiographyModal backHref="#" biography="My Bio" onSave={handleSave} />,
  );

  await userEvent.clear(getByDisplayValue('My Bio'));
  await userEvent.click(getByText(/save/i));
  expect(handleSave).not.toHaveBeenCalled();
});

it.skip('disables the form elements while submitting', async () => {
  // Suppress expected react-router warning about navigate() being called outside useEffect
  // TODO: Check if this should be here or if the test requires a refactor
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = renderModal(
    <BiographyModal backHref="#" biography="My Bio" onSave={handleSave} />,
  );

  await userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
  warnSpy.mockRestore();
});
