import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Router, StaticRouter } from 'react-router-dom';
import PublishModal from '../PublishModal';

describe('PublishModal', () => {
  const defaultProps = {
    backHref: '',
    onSave: jest.fn(),
  };
  it('renders the title', () => {
    render(<PublishModal {...defaultProps} />, { wrapper: StaticRouter });
    expect(
      screen.getByRole('heading', { name: /publish profile/i }),
    ).toBeVisible();
  });
  it('redirects to dashboard on save', async () => {
    const getUserConfirmation = jest.fn((_message, cb) => cb(true));
    const history = createMemoryHistory({ getUserConfirmation });
    const onSave = jest.fn();
    render(
      <Router history={history}>
        <PublishModal {...defaultProps} onSave={onSave} />
      </Router>,
    );
    const saveButton = screen.getByRole('button', { name: 'Publish' });
    userEvent.click(saveButton);
    await waitFor(() => {
      expect(history.location.pathname).toBe('/');
    });
    expect(onSave).toHaveBeenCalledWith({ onboarded: true });
  });
});
