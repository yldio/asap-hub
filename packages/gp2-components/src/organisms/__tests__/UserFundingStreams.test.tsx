import { render, screen } from '@testing-library/react';
import UserFundingStreams from '../UserFundingStreams';

describe('UserFundingStreams', () => {
  it('renders funding streams', () => {
    const fundingStreams = 'This is the funding providers section';
    render(<UserFundingStreams fundingStreams={fundingStreams} />);
    expect(screen.getByText(fundingStreams)).toBeVisible();
  });

  it('renders the right title', () => {
    render(<UserFundingStreams />);
    expect(
      screen.getByRole('heading', { name: 'Financial Disclosures' }),
    ).toBeVisible();
  });

  describe('if no funding streams', () => {
    it('renders placeholder when theres an edit link', () => {
      const { rerender } = render(<UserFundingStreams />);
      expect(
        screen.queryByText(/Please list any funding sources/i),
      ).not.toBeInTheDocument();
      rerender(<UserFundingStreams editHref="/" />);
      expect(
        screen.getByText(/Please list any funding sources/i),
      ).toBeVisible();
    });
  });
});
