import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../Layout';

describe('Layout', () => {
  const props: Omit<ComponentProps<typeof Layout>, 'children'> = {
    userId: '1',
    projects: [],
    workingGroups: [],
  };
  it('renders the header', async () => {
    render(
      <MemoryRouter>
        <Layout {...props}>Content</Layout>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeVisible();
    });
  });
  it('renders the content', () => {
    render(
      <MemoryRouter>
        <Layout {...props}>Content</Layout>
      </MemoryRouter>,
    );
    expect(screen.getByText('Content')).toBeVisible();
  });

  it('renders and toggles the open and close menu button', async () => {
    render(
      <MemoryRouter>
        <Layout {...props}>Content</Layout>
      </MemoryRouter>,
    );
    expect(screen.queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(screen.getByTitle(/menu/i)).toBeInTheDocument();

    await userEvent.click(screen.getByLabelText(/toggle menu/i));
    expect(screen.getByTitle(/close/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/menu/i)).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText(/toggle menu/i));
    expect(screen.queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(screen.getByTitle(/menu/i)).toBeInTheDocument();
  });

  it('closes the drawer when clicking the overlay', async () => {
    render(
      <MemoryRouter>
        <Layout {...props}>Content</Layout>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByLabelText(/toggle menu/i));

    await userEvent.click(screen.getByLabelText(/close/i));
    expect(screen.getByLabelText(/close/i)).not.toBeVisible();
  });

  it('closes the drawer on navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout {...props}>Content</Layout>
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByLabelText(/toggle menu/i));
    await waitFor(() => {
      expect(screen.getByLabelText(/close/i)).toBeVisible();
    });

    await userEvent.click(
      screen.getAllByText(/people/i, { selector: 'nav *' })[0]!,
    );
    await waitFor(() => {
      expect(screen.getByLabelText(/close/i)).not.toBeVisible();
    });
  });

  it('scrolls to top between page navigations', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout {...props}>Content</Layout>
      </MemoryRouter>,
    );

    await userEvent.click(
      screen.getAllByText(/people/i, { selector: 'nav *' })[0]!,
    );
    expect(screen.getByRole('main').scrollTo).toHaveBeenCalled();
  });
});
