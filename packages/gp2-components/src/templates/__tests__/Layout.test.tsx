import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from '..';

describe('Layout', () => {
  it('renders the header', () => {
    render(<Layout>Content</Layout>);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the content', () => {
    render(<Layout>Content</Layout>);
    expect(screen.getByText('Content')).toBeVisible();
  });

  it('renders and toggles the open and close menu button', () => {
    render(<Layout>Content</Layout>);
    expect(screen.queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(screen.getByTitle(/menu/i)).toBeInTheDocument();

    userEvent.click(screen.getByLabelText(/toggle menu/i));
    expect(screen.getByTitle(/close/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/menu/i)).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText(/toggle menu/i));
    expect(screen.queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(screen.getByTitle(/menu/i)).toBeInTheDocument();
  });

  it('closes the drawer when clicking the overlay', async () => {
    const { getByLabelText } = render(<Layout>Content</Layout>);
    userEvent.click(getByLabelText(/toggle menu/i));

    userEvent.click(getByLabelText(/close/i));
    expect(getByLabelText(/close/i)).not.toBeVisible();
  });

  it('closes the drawer on navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>Content</Layout>
      </MemoryRouter>,
    );
    userEvent.click(screen.getByLabelText(/toggle menu/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/close/i)).toBeVisible();
    });

    userEvent.click(
      screen.getAllByText(/dashboard/i, { selector: 'nav *' })[0],
    );
    await waitFor(() => {
      expect(screen.getByLabelText(/close/i)).not.toBeVisible();
    });
  });

  it('scrolls to top between page navigations', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>Content</Layout>
      </MemoryRouter>,
    );

    userEvent.click(
      screen.getAllByText(/dashboard/i, { selector: 'nav *' })[0],
    );
    expect(screen.getByRole('main').scrollTo).toHaveBeenCalled();
  });
});
