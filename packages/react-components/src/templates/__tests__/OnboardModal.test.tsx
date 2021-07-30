import { ComponentProps } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, StaticRouter } from 'react-router-dom';

import OnboardModal from '../OnboardModal';

const props: ComponentProps<typeof OnboardModal> = {
  backHref: '/wrong',
};
it('renders the title', () => {
  const { getByText } = render(<OnboardModal {...props} />, {
    wrapper: StaticRouter,
  });
  expect(
    getByText('Ready to publish your profile?', { selector: 'h3' }),
  ).toBeVisible();
});

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText } = render(<OnboardModal {...props} onSave={jestFn} />, {
    wrapper: MemoryRouter,
  });
  const publish = getByText(/continue and publish/i);
  userEvent.click(publish);

  expect(jestFn).toHaveBeenCalledWith({
    onboarded: true,
  });

  await waitFor(() => expect(publish.closest('button')).toBeEnabled());
});

it('disables publish & back while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(
    <OnboardModal {...props} onSave={handleSave} />,
    { wrapper: StaticRouter },
  );
  const publish = getByText(/continue and publish/i);

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
    <OnboardModal {...props} onSave={handleSave} />,
    { wrapper: StaticRouter },
  );

  const publish = getByText(/continue and publish/i);
  userEvent.click(publish);
  act(rejectSubmit);

  await waitFor(() => {
    expect(publish.closest('button')).toBeEnabled();
    expect(getByText(/error.+publish/i)).toBeVisible();
  });
});
