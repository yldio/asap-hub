import { render } from '@testing-library/react';
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
});
