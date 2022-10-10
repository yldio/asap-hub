import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import ProjectOverview from '../ProjectOverview';

describe('ProjectOverview', () => {
  const defaultProps = {
    keywords: [],
    milestones: [],
  };
  it('renders the description', () => {
    const description = 'this is a description';
    render(<ProjectOverview {...defaultProps} description={description} />);
    expect(
      screen.getByRole('heading', { name: 'Description' }),
    ).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });
  it('does not render the description if unavailable', () => {
    render(<ProjectOverview {...defaultProps} />);
    expect(
      screen.queryByRole('heading', { name: 'Description' }),
    ).not.toBeInTheDocument();
  });
  it('renders the contact information', () => {
    render(<ProjectOverview {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Contact Information' }),
    ).toBeInTheDocument();
  });
  it('renders the PM email information', () => {
    render(<ProjectOverview {...defaultProps} pmEmail={'tony@stark.com'} />);
    expect(
      screen.getByRole('link', { name: 'tony@stark.com' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'PM Email' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Lead Email' }),
    ).not.toBeInTheDocument();
  });
  it('renders the lead email information', () => {
    render(
      <ProjectOverview {...defaultProps} leadEmail={'peter@parker.com'} />,
    );
    expect(
      screen.getByRole('link', { name: 'peter@parker.com' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Lead Email' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'PM Email' }),
    ).not.toBeInTheDocument();
  });
  it('renders both the lead email and PM email information', () => {
    render(
      <ProjectOverview
        {...defaultProps}
        pmEmail={'tony@stark.com'}
        leadEmail={'peter@parker.com'}
      />,
    );
    expect(
      screen.getByRole('link', { name: 'peter@parker.com' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Lead Email' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'PM Email' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'tony@stark.com' }),
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
  it('displays the milestones', () => {
    render(
      <ProjectOverview
        {...defaultProps}
        milestones={[{ title: 'the milestone', status: 'Active' }]}
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'Project Milestones (1)' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /the milestone/ }),
    ).toBeInTheDocument();
  });
});
