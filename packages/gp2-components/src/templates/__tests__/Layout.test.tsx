import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
});
