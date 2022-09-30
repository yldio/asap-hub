import { render, screen } from '@testing-library/react';
import ProjectOverview from '../ProjectOverview';

describe('ProjectOverview', () => {
  const defaultProps = {
    description: 'this is a description',
    keywords: [],
  };
  it('renders the description', () => {
    render(<ProjectOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Description' }),
    ).toBeInTheDocument();
  });
  it('renders the contact information', () => {
    render(<ProjectOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Contact Information' }),
    ).toBeInTheDocument();
  });
});
