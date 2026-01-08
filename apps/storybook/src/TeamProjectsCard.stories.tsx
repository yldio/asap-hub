import { TeamProjectsCard } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Organisms / Team Projects Card',
  component: TeamProjectsCard,
};

export const DiscoveryTeamWithOriginalGrant = () => (
  <TeamProjectsCard
    teamType="Discovery Team"
    projectTitle={text('Project Title', 'Discovery Project Title')}
    projectSummary={text(
      'Original Grant Description',
      'This is the original grant description. It describes the initial funding and research objectives for this discovery project.',
    )}
    linkedProjectId={text('Linked Project ID', 'project-123')}
    projectStatus={
      text('Project Status', 'Active') as 'Active' | 'Completed' | 'Closed'
    }
    supplementGrant={undefined}
    researchTheme={text('Research Theme', 'Neurodegeneration')}
  />
);

export const DiscoveryTeamWithSupplementGrant = () => (
  <TeamProjectsCard
    teamType="Discovery Team"
    projectTitle={text('Project Title', 'Discovery Project Title')}
    projectSummary={text(
      'Original Grant Description',
      'This is the original grant description. It should not be displayed when supplement grant exists.',
    )}
    linkedProjectId={text('Linked Project ID', 'project-123')}
    projectStatus={
      text('Project Status', 'Active') as 'Active' | 'Completed' | 'Closed'
    }
    supplementGrant={{
      title: text('Supplement Grant Title', 'Supplement Grant Title'),
      description: text(
        'Supplement Grant Description',
        'This is the supplement grant description. It should be displayed instead of the original grant when supplement grant exists.',
      ),
      proposalURL: text('Proposal URL', 'proposal-456'),
    }}
    researchTheme={text('Research Theme', 'Neurodegeneration')}
  />
);

export const ResourceTeamWithOriginalGrant = () => (
  <TeamProjectsCard
    teamType="Resource Team"
    projectTitle={text('Project Title', 'Resource Project Title')}
    projectSummary={text(
      'Original Grant Description',
      'This is the original grant description for a resource project. It describes the initial funding and objectives.',
    )}
    linkedProjectId={text('Linked Project ID', 'project-456')}
    projectStatus={
      text('Project Status', 'Active') as 'Active' | 'Completed' | 'Closed'
    }
    supplementGrant={undefined}
    resourceType={text('Resource Type', 'Data Portal')}
  />
);

export const ResourceTeamWithSupplementGrant = () => (
  <TeamProjectsCard
    teamType="Resource Team"
    projectTitle={text('Project Title', 'Resource Project Title')}
    projectSummary={text(
      'Original Grant Description',
      'This is the original grant description. It should not be displayed when supplement grant exists.',
    )}
    linkedProjectId={text('Linked Project ID', 'project-456')}
    projectStatus={
      text('Project Status', 'Active') as 'Active' | 'Completed' | 'Closed'
    }
    supplementGrant={{
      title: text('Supplement Grant Title', 'Supplement Grant Title'),
      description: text(
        'Supplement Grant Description',
        'This is the supplement grant description for a resource project. It should be displayed instead of the original grant.',
      ),
      proposalURL: text('Proposal URL', 'proposal-789'),
    }}
    resourceType={text('Resource Type', 'Data Portal')}
  />
);
