import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from '..';

describe('Layout', () => {
  const props: Omit<ComponentProps<typeof Layout>, 'children'> = {
    userId: '1',
    projects: [],
    workingGroups: [],
  };
  it('renders the header', () => {
    render(<Layout {...props}>Content</Layout>);
    expect(screen.getByRole('banner')).toBeVisible();
  });
  it('renders the content', () => {
    render(<Layout {...props}>Content</Layout>);
    expect(screen.getByText('Content')).toBeVisible();
  });

  it('renders and toggles the open and close menu button', async () => {
    render(<Layout {...props}>Content</Layout>);
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
    render(<Layout {...props}>Content</Layout>);
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

    await userEvent.click(screen.getAllByText(/people/i, { selector: 'nav *' })[0]!);
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

    await userEvent.click(screen.getAllByText(/people/i, { selector: 'nav *' })[0]!);
    expect(screen.getByRole('main').scrollTo).toHaveBeenCalled();
  });
});
