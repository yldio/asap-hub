import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ProjectCard from '../ProjectCard';

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

describe('ProjectCard - Common Features', () => {
  it('links to the correct project detail page for Discovery', () => {
    render(<ProjectCard {...discoveryProjectProps} />);
    const links = Array.from(
      document.querySelectorAll('a'),
    ) as HTMLAnchorElement[];
    const projectLink = links.find((link) =>
      link.href.includes('/projects/Discovery/project-1'),
    );
    expect(projectLink).toBeDefined();
  });

  it('links to the correct project detail page for Resource', () => {
    render(<ProjectCard {...resourceProjectTeamBasedProps} />);
    const links = Array.from(
      document.querySelectorAll('a'),
    ) as HTMLAnchorElement[];
    const projectLink = links.find((link) =>
      link.href.includes('/projects/Resource/project-1'),
    );
    expect(projectLink).toBeDefined();
  });

  it('links to the correct project detail page for Trainee', () => {
    render(<ProjectCard {...traineeProjectProps} />);
    const links = Array.from(
      document.querySelectorAll('a'),
    ) as HTMLAnchorElement[];
    const projectLink = links.find((link) =>
      link.href.includes('/projects/Trainee/project-1'),
    );
    expect(projectLink).toBeDefined();
  });

  it('renders start and end dates', () => {
    const { getByText } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByText(/Jan 2023/)).toBeVisible();
    expect(getByText(/Dec 2025/)).toBeVisible();
  });

  it('renders duration', () => {
    const { getByText } = render(<ProjectCard {...discoveryProjectProps} />);
    expect(getByText(/3 yrs/)).toBeVisible();
  });
});
