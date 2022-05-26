import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Layout } from '..';

describe('Layout', () => {
  it('renders the header', () => {
    const { getByRole } = render(<Layout>Content</Layout>);
    expect(getByRole('banner')).toBeVisible();
  });
  it('renders the content', async () => {
    const { getByText } = render(<Layout>Content</Layout>);
    expect(getByText('Content')).toBeVisible();
  });

  it('renders and toggles the open and close menu button', async () => {
    const { getByLabelText, queryByTitle } = render(<Layout>Content</Layout>);
    expect(queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(queryByTitle(/menu/i)).toBeInTheDocument();

    userEvent.click(getByLabelText(/toggle menu/i));
    expect(queryByTitle(/close/i)).toBeInTheDocument();
    expect(queryByTitle(/menu/i)).not.toBeInTheDocument();

    userEvent.click(getByLabelText(/toggle menu/i));
    expect(queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(queryByTitle(/menu/i)).toBeInTheDocument();
  });
});
