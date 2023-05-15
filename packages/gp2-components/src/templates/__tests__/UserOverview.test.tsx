import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserOverview from '../UserOverview';

describe('UserOverview', () => {
  const defaultProps: ComponentProps<typeof UserOverview> = {
    id: '1',
    email: 'someone@example.com',
    keywords: [],
    questions: [],
    projects: [],
    workingGroups: [],
    firstName: 'Tony',
    contributingCohorts: [],
  };

  it('renders the default sections', () => {
    render(<UserOverview {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Biography' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Contact Details' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Keywords' })).toBeVisible();
  });

  it('renders the biography', () => {
    const biography = 'this is a biography';
    render(<UserOverview {...defaultProps} biography={biography} />);
    expect(screen.getByText(biography)).toBeVisible();
  });

  describe('Contact Information', () => {
    it('renders the Institutional email information', () => {
      render(<UserOverview {...defaultProps} email={'tony@stark.com'} />);
      expect(
        screen.getByRole('link', { name: 'tony@stark.com' }),
      ).toBeVisible();
      expect(
        screen.getByRole('heading', { name: 'Institutional email' }),
      ).toBeVisible();
      expect(
        screen.queryByRole('heading', { name: 'Alternative email' }),
      ).not.toBeInTheDocument();
    });
    it('renders the alternative email information', () => {
      render(
        <UserOverview
          {...defaultProps}
          alternativeEmail={'peter@parker.com'}
        />,
      );
      expect(
        screen.getByRole('link', { name: 'peter@parker.com' }),
      ).toBeVisible();
      expect(
        screen.getByRole('heading', { name: 'Alternative email' }),
      ).toBeVisible();
    });
    it('renders both the Institutional email and alternative email information', () => {
      render(
        <UserOverview
          {...defaultProps}
          email={'tony@stark.com'}
          alternativeEmail={'peter@parker.com'}
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

  describe('Projects', () => {
    it('renders the projects', () => {
      const projects: gp2.UserResponse['projects'] = [
        {
          id: '1',
          title: 'Project 1',
          members: [],
          status: 'Active',
        },
      ];
      render(<UserOverview {...defaultProps} projects={projects} />);
      expect(
        screen.getByRole('heading', { name: 'Projects' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /Project 1/ }),
      ).toBeInTheDocument();
    });

    it('does not render the projects when there are no projects available', () => {
      const projects: gp2.UserResponse['projects'] = [];
      render(<UserOverview {...defaultProps} projects={projects} />);
      expect(
        screen.queryByRole('heading', { name: 'Projects' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Working Groups', () => {
    it('renders the working-groups', () => {
      const workingGroups: gp2.UserResponse['workingGroups'] = [
        {
          id: '1',
          title: 'Working Group 1',
          members: [],
        },
      ];
      render(<UserOverview {...defaultProps} workingGroups={workingGroups} />);
      expect(
        screen.getByRole('heading', { name: 'Working Groups' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /Working Group 1/ }),
      ).toBeInTheDocument();
    });

    it('does not render the working-groups when there are no working-groups available', () => {
      const workingGroups: gp2.UserResponse['workingGroups'] = [];
      render(<UserOverview {...defaultProps} workingGroups={workingGroups} />);
      expect(
        screen.queryByRole('heading', { name: 'Working Groups' }),
      ).not.toBeInTheDocument();
    });
  });

  it.each(gp2.keywords)('renders the keyword: %s', (keyword) => {
    render(
      <UserOverview {...defaultProps} keywords={[keyword]}>
        Body
      </UserOverview>,
    );

    expect(screen.getByText(keyword)).toBeVisible();
  });

  describe('funding streams', () => {
    it('renders the funding streams', () => {
      const fundingStreams = 'this is a funding stream';
      render(
        <UserOverview {...defaultProps} fundingStreams={fundingStreams} />,
      );
      expect(
        screen.getByRole('heading', { name: 'Financial Disclosures' }),
      ).toBeInTheDocument();
      expect(screen.getByText(fundingStreams)).toBeVisible();
    });
    it('does not renders the funding streams if unavailable', () => {
      render(<UserOverview {...defaultProps} />);
      expect(
        screen.queryByRole('heading', { name: 'Financial Disclosures' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('questions', () => {
    it('renders the questions', () => {
      const questions = ['this is a funding stream'];
      render(<UserOverview {...defaultProps} questions={questions} />);
      expect(
        screen.getByRole('heading', { name: 'Open Questions' }),
      ).toBeVisible();
      expect(screen.getByText(questions[0]!)).toBeVisible();
    });
    it('does not renders the questions if unavailable', () => {
      render(<UserOverview {...defaultProps} />);
      expect(
        screen.queryByRole('heading', { name: 'Open Questions' }),
      ).not.toBeInTheDocument();
    });
  });
  describe('Contributing Cohorts', () => {
    it('renders the cohrots', () => {
      const cohorts: gp2.UserResponse['contributingCohorts'] = [
        {
          role: 'Investigator',
          name: 'a cohort',
          contributingCohortId: '42',
          studyUrl: 'a-link',
        },
      ];
      render(<UserOverview {...defaultProps} contributingCohorts={cohorts} />);
      expect(
        screen.getByRole('heading', { name: 'Contributing Cohort Studies' }),
      ).toBeVisible();
    });
    it('does not renders the cohorts if unavailable', () => {
      render(<UserOverview {...defaultProps} />);
      expect(
        screen.queryByRole('heading', { name: 'Contributing Cohort Studies' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('external profiles', () => {
    it('renders the external profiles section when user has any social defined', () => {
      const social = {
        googleScholar: 'googleScholar',
      };

      render(<UserOverview {...defaultProps} social={social} />);
      expect(
        screen.getByRole('heading', { name: 'External Profiles' }),
      ).toBeVisible();
    });

    it('does not render the external profiles section when user does not have any social defined', () => {
      render(<UserOverview {...defaultProps} />);
      expect(
        screen.queryByRole('heading', { name: 'External Profiles' }),
      ).not.toBeInTheDocument();
    });
  });
});
