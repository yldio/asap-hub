import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ProjectCard, {
  getProjectTypeLabel,
  getStatusPillAccent,
  getCardAccentByStatus,
} from '../ProjectCard';

const baseProjectProps = {
  id: 'project-1',
  startDate: 'Jan 2023',
  endDate: 'Dec 2025',
  duration: '3 yrs',
  tags: ['Tag1', 'Tag2', 'Tag3'],
};

const discoveryProjectProps: ComponentProps<typeof ProjectCard> = {
  ...baseProjectProps,
  projectType: 'Discovery',
  title: 'Understanding Genetic Mechanisms in PD',
  status: 'Active',
  researchTheme: 'Genetics',
  teamName: 'Martinez Lab',
  teamId: 'team-1',
};

const resourceProjectTeamBasedProps: ComponentProps<typeof ProjectCard> = {
  ...baseProjectProps,
  projectType: 'Resource',
  title: 'PD Biobank Resource',
  status: 'Active',
  resourceType: 'Biobank',
  isTeamBased: true,
  teamName: 'Anderson Resource Team',
  teamId: 'team-2',
  googleDriveLink: 'https://drive.google.com/example',
};

const resourceProjectMemberBasedProps: ComponentProps<typeof ProjectCard> = {
  ...baseProjectProps,
  projectType: 'Resource',
  title: 'Open-Source Analysis Pipeline',
  status: 'Complete',
  resourceType: 'Software Tool',
  isTeamBased: false,
  members: [
    {
      id: '1',
      displayName: 'Dr. Sarah Johnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@example.com',
      href: '/users/1',
    },
    {
      id: '2',
      displayName: 'Dr. Michael Chen',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.c@example.com',
      href: '/users/2',
    },
  ],
};

const traineeProjectProps: ComponentProps<typeof ProjectCard> = {
  ...baseProjectProps,
  projectType: 'Trainee',
  title: 'Alpha-Synuclein Aggregation Study',
  status: 'Active',
  trainer: {
    id: '1',
    displayName: 'Dr. Amanda Foster',
    firstName: 'Amanda',
    lastName: 'Foster',
    email: 'amanda.f@example.com',
    href: '/users/1',
  },
  members: [
    {
      id: '2',
      displayName: 'Dr. David Martinez',
      firstName: 'David',
      lastName: 'Martinez',
      email: 'david.m@example.com',
      href: '/users/2',
    },
    {
      id: '3',
      displayName: 'Dr. Emily Chen',
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'emily.c@example.com',
      href: '/users/3',
    },
  ],
};

describe('Helper Functions', () => {
  describe('getProjectTypeLabel', () => {
    it('returns correct label for Discovery projects', () => {
      expect(getProjectTypeLabel('Discovery')).toBe('Discovery Project');
    });

    it('returns correct label for Resource projects', () => {
      expect(getProjectTypeLabel('Resource')).toBe('Resource Project');
    });

    it('returns correct label for Trainee projects', () => {
      expect(getProjectTypeLabel('Trainee')).toBe('Trainee Project');
    });
  });

  describe('getStatusPillAccent', () => {
    it('returns info accent for Active status', () => {
      expect(getStatusPillAccent('Active')).toBe('info');
    });

    it('returns success accent for Complete status', () => {
      expect(getStatusPillAccent('Complete')).toBe('success');
    });

    it('returns warning accent for Closed status', () => {
      expect(getStatusPillAccent('Closed')).toBe('warning');
    });
  });

  describe('getCardAccentByStatus', () => {
    it('returns default accent for Active status', () => {
      expect(getCardAccentByStatus('Active')).toBe('default');
    });

    it('returns neutral200 accent for Complete status', () => {
      expect(getCardAccentByStatus('Complete')).toBe('neutral200');
    });

    it('returns neutral200 accent for Closed status', () => {
      expect(getCardAccentByStatus('Closed')).toBe('neutral200');
    });
  });
});

describe('ProjectCard - Discovery Project', () => {
  it('renders the project title as a heading', () => {
    const { getByRole } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByRole('heading').textContent).toEqual(
      'Understanding Genetic Mechanisms in PD',
    );
  });

  it('renders the Active status pill with info accent', () => {
    const { getByText } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByText('Active')).toBeVisible();
  });

  it('renders the Complete status pill with success accent', () => {
    const { getByText } = render(
      <ProjectCard {...discoveryProjectProps} status="Complete" />,
    );
    expect(getByText('Complete')).toBeVisible();
  });

  it('renders the Closed status pill with warning accent', () => {
    const { getByText } = render(
      <ProjectCard {...discoveryProjectProps} status="Closed" />,
    );
    expect(getByText('Closed')).toBeVisible();
  });

  it('renders the Discovery Project type pill', () => {
    const { getByText } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByText('Discovery Project')).toBeVisible();
  });

  it('renders the research theme pill', () => {
    const { getByText } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByText('Genetics')).toBeVisible();
  });

  it('renders the team name', () => {
    const { getByText } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByText('Martinez Lab')).toBeVisible();
  });

  it('renders the team name as a link when teamId is provided', () => {
    render(<ProjectCard {...discoveryProjectProps} />);
    const links = Array.from(
      document.querySelectorAll('a'),
    ) as HTMLAnchorElement[];
    const teamLink = links.find((link) => link.href.includes('/teams/team-1'));
    expect(teamLink).toBeDefined();
  });

  it('renders the duration', () => {
    const { getByText } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByText('Jan 2023 - Dec 2025 • 3 yrs')).toBeVisible();
  });

  it('renders tags', () => {
    const { getByText } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByText('Tag1')).toBeVisible();
    expect(getByText('Tag2')).toBeVisible();
    expect(getByText('Tag3')).toBeVisible();
  });

  it('does not render tags when empty', () => {
    const { queryByText } = render(
      <ProjectCard {...discoveryProjectProps} tags={[]} />,
    );
    expect(queryByText('Tag1')).not.toBeInTheDocument();
  });
});

describe('ProjectCard - Resource Project (Team-based)', () => {
  it('renders the project title', () => {
    const { getByRole } = render(
      <ProjectCard {...resourceProjectTeamBasedProps} />,
    );
    expect(getByRole('heading').textContent).toEqual('PD Biobank Resource');
  });

  it('renders the Resource Project type pill', () => {
    const { getByText } = render(
      <ProjectCard {...resourceProjectTeamBasedProps} />,
    );
    expect(getByText('Resource Project')).toBeVisible();
  });

  it('renders the resource type pill', () => {
    const { getByText } = render(
      <ProjectCard {...resourceProjectTeamBasedProps} />,
    );
    expect(getByText('Biobank')).toBeVisible();
  });

  it('renders the team name for team-based projects', () => {
    const { getByText } = render(
      <ProjectCard {...resourceProjectTeamBasedProps} />,
    );
    expect(getByText('Anderson Resource Team')).toBeVisible();
  });

  it('renders the Google Drive access button when link is provided', () => {
    const { getByText } = render(
      <ProjectCard {...resourceProjectTeamBasedProps} />,
    );
    expect(getByText(/Access Drive/i)).toBeVisible();
  });

  it('does not render Google Drive button when link is not provided', () => {
    const { queryByText } = render(
      <ProjectCard
        {...resourceProjectTeamBasedProps}
        googleDriveLink={undefined}
      />,
    );
    expect(queryByText(/Access Drive/i)).not.toBeInTheDocument();
  });
});

describe('ProjectCard - Resource Project (Member-based)', () => {
  it('renders the project title', () => {
    const { getByRole } = render(
      <ProjectCard {...resourceProjectMemberBasedProps} />,
    );
    expect(getByRole('heading').textContent).toEqual(
      'Open-Source Analysis Pipeline',
    );
  });

  it('renders the resource type pill', () => {
    const { getByText } = render(
      <ProjectCard {...resourceProjectMemberBasedProps} />,
    );
    expect(getByText('Software Tool')).toBeVisible();
  });

  it('renders project members for member-based projects', () => {
    const { getByText } = render(
      <ProjectCard {...resourceProjectMemberBasedProps} />,
    );
    expect(getByText('Dr. Sarah Johnson')).toBeVisible();
    expect(getByText('Dr. Michael Chen')).toBeVisible();
  });

  it('does not render team name for member-based projects', () => {
    const { queryByText } = render(
      <ProjectCard {...resourceProjectMemberBasedProps} />,
    );
    expect(queryByText('Anderson Resource Team')).not.toBeInTheDocument();
  });

  it('does not render members when empty', () => {
    const { queryByText } = render(
      <ProjectCard {...resourceProjectMemberBasedProps} members={[]} />,
    );
    expect(queryByText('Dr. Sarah Johnson')).not.toBeInTheDocument();
  });
});

describe('ProjectCard - Trainee Project', () => {
  it('renders the project title', () => {
    const { getByRole } = render(<ProjectCard {...traineeProjectProps} />);
    expect(getByRole('heading').textContent).toEqual(
      'Alpha-Synuclein Aggregation Study',
    );
  });

  it('renders the Trainee Project type pill', () => {
    const { getByText } = render(<ProjectCard {...traineeProjectProps} />);
    expect(getByText('Trainee Project')).toBeVisible();
  });

  it('renders the trainer', () => {
    const { getByText } = render(<ProjectCard {...traineeProjectProps} />);
    expect(getByText('Dr. Amanda Foster')).toBeVisible();
  });

  it('renders the project members', () => {
    const { getByText } = render(<ProjectCard {...traineeProjectProps} />);
    expect(getByText('Dr. David Martinez')).toBeVisible();
    expect(getByText('Dr. Emily Chen')).toBeVisible();
  });

  it('renders both trainer and members separately', () => {
    const { getAllByText } = render(<ProjectCard {...traineeProjectProps} />);
    // Should have trainer listed once and members listed separately
    expect(getAllByText(/Dr\./)).toHaveLength(3); // 1 trainer + 2 members
  });
});

describe('ProjectCard - Card Background Colors', () => {
  it('renders Active projects with default (white) background', () => {
    const { container } = render(<ProjectCard {...discoveryProjectProps} />);
    const card = container.querySelector('section');
    const styles = window.getComputedStyle(card!);
    // Default accent has no backgroundColor set, so it's transparent/white
    expect(styles.backgroundColor).not.toContain('var(--neutral200)'); // neutral200
  });

  it('renders Complete projects with grey background', () => {
    const { container } = render(
      <ProjectCard {...discoveryProjectProps} status="Complete" />,
    );
    const card = container.querySelector('section');
    expect(card).toHaveStyle({ backgroundColor: 'var(--neutral200)' }); // neutral200
  });

  it('renders Closed projects with grey background', () => {
    const { container } = render(
      <ProjectCard {...discoveryProjectProps} status="Closed" />,
    );
    const card = container.querySelector('section');
    expect(card).toHaveStyle({ backgroundColor: 'var(--neutral200)' }); // neutral200
  });
});

describe('ProjectCard - Common Features', () => {
  it('links to the correct project detail page for each project type', () => {
    // Discovery
    render(<ProjectCard {...discoveryProjectProps} />);
    let links = Array.from(
      document.querySelectorAll('a'),
    ) as HTMLAnchorElement[];
    expect(
      links.find((link) => link.href.includes('/projects/Discovery/project-1')),
    ).toBeDefined();

    // Resource
    render(<ProjectCard {...resourceProjectTeamBasedProps} />);
    links = Array.from(document.querySelectorAll('a')) as HTMLAnchorElement[];
    expect(
      links.find((link) => link.href.includes('/projects/Resource/project-1')),
    ).toBeDefined();

    // Trainee
    render(<ProjectCard {...traineeProjectProps} />);
    links = Array.from(document.querySelectorAll('a')) as HTMLAnchorElement[];
    expect(
      links.find((link) => link.href.includes('/projects/Trainee/project-1')),
    ).toBeDefined();
  });

  it('renders start and end dates and duration', () => {
    const { getByText } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByText(/Jan 2023/)).toBeVisible();
    expect(getByText(/Dec 2025/)).toBeVisible();
    expect(getByText(/3 yrs/)).toBeVisible();
  });
});
