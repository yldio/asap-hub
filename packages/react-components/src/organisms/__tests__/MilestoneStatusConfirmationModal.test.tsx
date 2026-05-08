import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MilestoneStatusConfirmationModal from '../MilestoneStatusConfirmationModal';

const loadOptions = jest.fn(() => Promise.resolve([]));

describe('MilestoneStatusConfirmationModal', () => {
  it('renders the Complete title and copy', async () => {
    render(
      <MilestoneStatusConfirmationModal
        status="Complete"
        loadCurrentArticles={() => Promise.resolve([])}
        loadOptions={loadOptions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          /Set status to Complete\? This action is irreversible/i,
        ),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/Before marking a milestone as Complete/i),
    ).toBeInTheDocument();
  });

  it('renders the Terminated title and copy', async () => {
    render(
      <MilestoneStatusConfirmationModal
        status="Terminated"
        loadCurrentArticles={() => Promise.resolve([])}
        loadOptions={loadOptions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByText(
          /Set status to Terminated\? This action is irreversible/i,
        ),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/Before marking a milestone as Terminated/i),
    ).toBeInTheDocument();
  });

  it('disables Confirm and Notify while articles are still loading', async () => {
    render(
      <MilestoneStatusConfirmationModal
        status="Complete"
        loadCurrentArticles={() => new Promise(() => {})}
        loadOptions={loadOptions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: /Confirm and Notify/i }),
    ).toBeDisabled();
  });

  it('keeps Confirm and Notify disabled and shows an error if loading fails', async () => {
    render(
      <MilestoneStatusConfirmationModal
        status="Complete"
        loadCurrentArticles={() => Promise.reject(new Error('boom'))}
        loadOptions={loadOptions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByText(/Could not load existing articles/i),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', { name: /Confirm and Notify/i }),
    ).toBeDisabled();
  });

  it('does not call onConfirm if Confirm and Notify is clicked while loading', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    render(
      <MilestoneStatusConfirmationModal
        status="Complete"
        loadCurrentArticles={() => new Promise(() => {})}
        loadOptions={loadOptions}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Confirm and Notify/i }),
    );
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Keep Editing is clicked', async () => {
    const onClose = jest.fn();
    render(
      <MilestoneStatusConfirmationModal
        status="Complete"
        loadCurrentArticles={() => Promise.resolve([])}
        loadOptions={loadOptions}
        onClose={onClose}
        onConfirm={jest.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Keep Editing/i }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it('opens and closes the multi-select menu', async () => {
    render(
      <MilestoneStatusConfirmationModal
        status="Complete"
        loadCurrentArticles={() => Promise.resolve([])}
        loadOptions={loadOptions}
        onClose={jest.fn()}
        onConfirm={jest.fn(() => Promise.resolve())}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Confirm and Notify/i }),
      ).toBeEnabled(),
    );
    const select = screen.getByRole('combobox');
    // Open the menu — covers onMenuOpen
    await act(async () => {
      select.focus();
      fireEvent.mouseDown(select);
    });
    await waitFor(() => expect(loadOptions).toHaveBeenCalled());
    // Close the menu — covers onMenuClose
    await act(async () => {
      fireEvent.blur(select);
    });
  });

  it('submits with the loaded articles when nothing is changed', async () => {
    const onConfirm = jest.fn(() => Promise.resolve());
    const onClose = jest.fn();
    render(
      <MilestoneStatusConfirmationModal
        status="Complete"
        loadCurrentArticles={() =>
          Promise.resolve([
            {
              id: 'ro-1',
              title: 'Existing article',
              href: '/shared-research/ro-1',
              type: 'Preprint',
            },
          ])
        }
        loadOptions={loadOptions}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );
    // wait for articles to load (Confirm becomes enabled)
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Confirm and Notify/i }),
      ).toBeEnabled(),
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Confirm and Notify/i }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onConfirm).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'ro-1', title: 'Existing article' }),
    ]);
  });

  it('disables Confirm and Notify and shows a spinner while saving', async () => {
    let resolveOnConfirm!: () => void;
    const onConfirm = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveOnConfirm = resolve;
        }),
    );
    const onClose = jest.fn();
    render(
      <MilestoneStatusConfirmationModal
        status="Complete"
        loadCurrentArticles={() => Promise.resolve([])}
        loadOptions={loadOptions}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Confirm and Notify/i }),
      ).toBeEnabled(),
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Confirm and Notify/i }),
    );
    // While the promise is pending, the button is disabled and modal stays open
    expect(
      screen.getByRole('button', { name: /Confirm and Notify/i }),
    ).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
    // Resolve the save and the modal closes
    resolveOnConfirm();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('closes the modal after onConfirm rejects so the parent can show a toast', async () => {
    const onConfirm = jest.fn(() => Promise.reject(new Error('boom')));
    const onClose = jest.fn();
    render(
      <MilestoneStatusConfirmationModal
        status="Complete"
        loadCurrentArticles={() => Promise.resolve([])}
        loadOptions={loadOptions}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Confirm and Notify/i }),
      ).toBeEnabled(),
    );
    await userEvent.click(
      screen.getByRole('button', { name: /Confirm and Notify/i }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onConfirm).toHaveBeenCalled();
  });
});
