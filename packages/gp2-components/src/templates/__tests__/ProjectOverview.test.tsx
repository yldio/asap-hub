import { gp2 } from '@asap-hub/model';
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
  it.each(gp2.projectKeywords)('renders the keyword: %s', (keyword) => {
    render(
      <ProjectOverview {...defaultProps} keywords={[keyword]}>
        Body
      </ProjectOverview>,
    );

    expect(screen.getByText(keyword)).toBeInTheDocument();
  });
});
