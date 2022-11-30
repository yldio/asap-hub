import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserOverview from '../UserOverview';

describe('UserOverview', () => {
  const defaultProps: ComponentProps<typeof UserOverview> = {
    email: 'someone@example.com',
    keywords: [],
  };
  it('renders the description', () => {
    const biography = 'this is a biography';
    render(<UserOverview {...defaultProps} biography={biography} />);
    expect(
      screen.getByRole('heading', { name: 'Biography' }),
    ).toBeInTheDocument();
    expect(screen.getByText(biography)).toBeInTheDocument();
  });
  it('does renders the biography if unavailable', () => {
    render(<UserOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Biography' }),
    ).toBeInTheDocument();
  });
  it('renders the contact information', () => {
    render(<UserOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Contact Information' }),
    ).toBeInTheDocument();
  });
  it('renders the Institutional email information', () => {
    render(<UserOverview {...defaultProps} email={'tony@stark.com'} />);
    expect(
      screen.getByRole('link', { name: 'tony@stark.com' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Institutional email' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Alternative email' }),
    ).not.toBeInTheDocument();
  });
  it('renders the alternative email information', () => {
    render(
      <UserOverview {...defaultProps} secondaryEmail={'peter@parker.com'} />,
    );
    expect(
      screen.getByRole('link', { name: 'peter@parker.com' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Alternative email' }),
    ).toBeInTheDocument();
  });
  it('renders both the lead email and PM email information', () => {
    render(
      <UserOverview
        {...defaultProps}
        email={'tony@stark.com'}
        secondaryEmail={'peter@parker.com'}
      />,
    );
    expect(
      screen.getByRole('link', { name: 'peter@parker.com' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Alternative email' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Institutional email' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'tony@stark.com' }),
    ).toBeInTheDocument();
  });
  it('renders the keywords', () => {
    render(<UserOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Expertise and Interests' }),
    ).toBeInTheDocument();
  });
  it.each(gp2.keywords)('renders the keyword: %s', (keyword) => {
    render(
      <UserOverview {...defaultProps} keywords={[keyword]}>
        Body
      </UserOverview>,
    );

    expect(screen.getByText(keyword)).toBeInTheDocument();
  });
});
