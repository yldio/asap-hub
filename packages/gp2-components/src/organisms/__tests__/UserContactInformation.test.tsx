import { render, screen } from '@testing-library/react';
import UserContactInformation from '../UserContactInformation';

describe('UserContactInformation', () => {
  it('renders emails', () => {
    const email = 'email@example.io';
    const alternativeEmail = 'alternative.email@example.io';
    render(
      <UserContactInformation
        email={email}
        alternativeEmail={alternativeEmail}
      />,
    );
    expect(screen.getByRole('link', { name: email })).toBeVisible();
    expect(screen.getByRole('link', { name: alternativeEmail })).toBeVisible();
  });
  it('renders the right title', () => {
    render(<UserContactInformation email="" />);
    expect(
      screen.getByRole('heading', { name: 'Contact Details' }),
    ).toBeVisible();
  });
  describe('if no alternative email', () => {
    it('renders placeholder when theres an edit link', () => {
      const { rerender } = render(<UserContactInformation email="" />);
      expect(screen.queryByText(/alternative email/i)).not.toBeInTheDocument();
      rerender(<UserContactInformation email="" editHref="/" />);
      expect(screen.getByText(/alternative email/i)).toBeVisible();
    });
  });
});
