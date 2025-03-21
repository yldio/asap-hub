import { ComponentProps, ReactNode } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';

import ConfirmModal from '../ConfirmModal';

const props: ComponentProps<typeof ConfirmModal> = {
  backHref: '/wrong',
  title: '',
};

const renderModal = (children: ReactNode) =>
  render(<StaticRouter>{children}</StaticRouter>);

it('renders the title', () => {
  const { getByText } = renderModal(
    <ConfirmModal {...props} title="Ready to publish your profile?" />,
  );
  expect(
    getByText('Ready to publish your profile?', { selector: 'h3' }),
  ).toBeVisible();
});

it('renders the description when it is a string', () => {
  const { getByText } = renderModal(
    <ConfirmModal {...props} description="test description" />,
  );
  expect(getByText('test description', { selector: 'p' })).toBeVisible();
});

it('renders the description when it is a react node', () => {
  const { getByText } = renderModal(
    <ConfirmModal {...props} description={<span>test description</span>} />,
  );
  expect(getByText('test description', { selector: 'span' })).toBeVisible();
});

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText } = renderModal(
    <ConfirmModal
      {...props}
      confirmText="Publish and Explore"
      onSave={jestFn}
    />,
  );
  const publish = getByText(/Publish and Explore/i);
  userEvent.click(publish);

  expect(jestFn).toHaveBeenCalled();

  await waitFor(() => expect(publish.closest('button')).toBeEnabled());
});

it('triggers the cancel function', async () => {
  const jestFn = jest.fn();
  const { getByText } = renderModal(
    <ConfirmModal
      {...props}
      backHref={undefined}
      cancelText="Cancel"
      onCancel={jestFn}
    />,
  );
  const cancel = getByText(/Cancel/i);
  userEvent.click(cancel);

  expect(jestFn).toHaveBeenCalled();
});

it('disables publish & back while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = renderModal(
    <ConfirmModal
      {...props}
      confirmText="Publish and Explore"
      cancelText="back"
      onSave={handleSave}
    />,
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
  const { getByText } = renderModal(
    <ConfirmModal
      {...props}
      confirmText="Publish and Explore"
      error="There has been an error publishing"
      onSave={handleSave}
    />,
  );

  const publish = getByText(/Publish and Explore/i);
  userEvent.click(publish);
  act(rejectSubmit);

  await waitFor(() => {
    expect(publish.closest('button')).toBeEnabled();
    expect(getByText(/error.+publish/i)).toBeVisible();
  });
});
