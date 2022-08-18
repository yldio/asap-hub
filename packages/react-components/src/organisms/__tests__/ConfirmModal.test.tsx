import { ComponentProps } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, StaticRouter } from 'react-router-dom';

import ConfirmModal from '../ConfirmModal';

const props: ComponentProps<typeof ConfirmModal> = {
  backHref: '/wrong',
  title: '',
};
it('renders the title', () => {
  const { getByText } = render(
    <ConfirmModal {...props} title="Ready to publish your profile?" />,
    {
      wrapper: StaticRouter,
    },
  );
  expect(
    getByText('Ready to publish your profile?', { selector: 'h3' }),
  ).toBeVisible();
});

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <ConfirmModal
      {...props}
      confirmText="Publish and Explore"
      onSave={jestFn}
    />,
    {
      wrapper: MemoryRouter,
    },
  );
  const publish = getByText(/Publish and Explore/i);
  userEvent.click(publish);

  expect(jestFn).toHaveBeenCalled();

  await waitFor(() => expect(publish.closest('button')).toBeEnabled());
});

it('disables publish & back while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(
    <ConfirmModal
      {...props}
      confirmText="Publish and Explore"
      cancelText="back"
      onSave={handleSave}
    />,
    { wrapper: StaticRouter },
  );
  const publish = getByText(/Publish and Explore/i);

  userEvent.click(publish);
  expect(publish.closest('button')).toBeDisabled();
  expect(getByText(/back/i).closest('a')).not.toHaveAttribute('href');

  act(resolveSubmit);
  await waitFor(() => expect(publish.closest('button')).toBeEnabled());
});

it('displays error message when save fails', async () => {
  let rejectSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((_, reject) => {
      rejectSubmit = reject;
    });
  const { getByText } = render(
    <ConfirmModal
      {...props}
      confirmText="Publish and Explore"
      error="There has been an error publishing"
      onSave={handleSave}
    />,
    { wrapper: StaticRouter },
  );

  const publish = getByText(/Publish and Explore/i);
  userEvent.click(publish);
  act(rejectSubmit);

  await waitFor(() => {
    expect(publish.closest('button')).toBeEnabled();
    expect(getByText(/error.+publish/i)).toBeVisible();
  });
});
