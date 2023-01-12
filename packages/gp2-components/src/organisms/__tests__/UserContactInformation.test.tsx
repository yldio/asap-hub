import { render, screen } from '@testing-library/react';
import UserContactInformation from '../UserContactInformation';

describe('UserContactInformation', () => {
  it('renders emails', () => {
    const email = 'email@example.io';
    const secondaryEmail = 'secondary.email@example.io';
    render(
      <UserContactInformation email={email} secondaryEmail={secondaryEmail} />,
    );
    expect(screen.getByRole('link', { name: email })).toBeVisible();
    expect(screen.getByRole('link', { name: secondaryEmail })).toBeVisible();
  });
  it('renders the right title', () => {
    render(<UserContactInformation email="" />);
    expect(
      screen.getByRole('heading', { name: 'Contact Information' }),
    ).toBeVisible();
  });
  describe('if no alternative email', () => {
    it('renders placeholder when theres an edit link', () => {
      const { rerender } = render(<UserContactInformation email="" />);
      expect(screen.queryByText(/provide alternative/i)).toBeNull();
      rerender(<UserContactInformation email="" editHref="/" />);
      expect(screen.getByText(/provide alternative/i)).toBeVisible();
    });
  });
});
