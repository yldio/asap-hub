import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserOverview from '../UserOverview';

describe('UserOverview', () => {
  const defaultProps: ComponentProps<typeof UserOverview> = {
    email: 'someone@example.com',
    keywords: [],
    questions: [],
    firstName: 'Tony',
  };

  it('renders the default sections', () => {
    render(<UserOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Biography' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Contact Information' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Expertise and Interests' }),
    ).toBeInTheDocument();
  });

  it('renders the biography', () => {
    const biography = 'this is a biography';
    render(<UserOverview {...defaultProps} biography={biography} />);
    expect(screen.getByText(biography)).toBeInTheDocument();
  });

  describe('Contact Information', () => {
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
    it('renders both the Institutional email and alternative email information', () => {
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
  });

  it.each(gp2.keywords)('renders the keyword: %s', (keyword) => {
    render(
      <UserOverview {...defaultProps} keywords={[keyword]}>
        Body
      </UserOverview>,
    );

    expect(screen.getByText(keyword)).toBeInTheDocument();
  });

  describe('funding streams', () => {
    it('renders the funding streams', () => {
      const fundingStreams = 'this is a funding stream';
      render(
        <UserOverview {...defaultProps} fundingStreams={fundingStreams} />,
      );
      expect(
        screen.getByRole('heading', { name: 'Funding Streams' }),
      ).toBeInTheDocument();
      expect(screen.getByText(fundingStreams)).toBeInTheDocument();
    });
    it('does not renders the funding streams if unavailable', () => {
      render(<UserOverview {...defaultProps} />);
      expect(
        screen.queryByRole('heading', { name: 'Funding Streams' }),
      ).not.toBeInTheDocument();
    });
  });
  describe('questions', () => {
    it('renders the questions', () => {
      const questions = ['this is a funding stream'];
      render(<UserOverview {...defaultProps} questions={questions} />);
      expect(
        screen.getByRole('heading', { name: 'Open Questions' }),
      ).toBeInTheDocument();
      expect(screen.getByText(questions[0])).toBeVisible();
    });
  });
});
