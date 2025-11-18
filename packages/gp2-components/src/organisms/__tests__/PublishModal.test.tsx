import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import PublishModal from '../PublishModal';

describe('PublishModal', () => {
  const defaultProps = {
    backHref: '',
    onSave: jest.fn(),
  };
  it('renders the title', () => {
    render(
      <StaticRouter location="/">
        <PublishModal {...defaultProps} />
      </StaticRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /publish profile/i }),
    ).toBeVisible();
  });
  it('redirects to dashboard on save', async () => {
    const onSave = jest.fn();
    const router = createMemoryRouter(
      [
        {
          path: '/*',
          element: <PublishModal {...defaultProps} onSave={onSave} />,
        },
      ],
      { initialEntries: ['/'] }
    );
    render(<RouterProvider router={router} />);
    const saveButton = screen.getByRole('button', { name: 'Publish' });
    await userEvent.click(saveButton);
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
    expect(onSave).toHaveBeenCalledWith({ onboarded: true });
  });
});
