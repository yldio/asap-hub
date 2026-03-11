import { ProjectDetail, ProjectAimsGrant } from '@asap-hub/model';
import { useFlags } from '@asap-hub/react-context';
import { css } from '@emotion/react';
import { rem } from '../pixels';
import {
  ProfileExpertiseAndResources,
  ProjectDetailOverview,
  ProjectContributors,
  ProjectAims,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';

// TODO: ASAP-1357 — Replace with real data from props
const DUMMY_AIMS_DATA: ReadonlyArray<ProjectAimsGrant> = [
  {
    grantTitle: 'Original Grant',
    aims: [
      {
        id: 'aim-1',
        order: 1,
        description:
          'Characterize the molecular mechanisms underlying alpha-synuclein aggregation in dopaminergic neurons using advanced imaging techniques and biochemical assays.',
        status: 'Complete',
        articleCount: 3,
      },
      {
        id: 'aim-2',
        order: 2,
        description:
          'Develop novel computational models to predict protein misfolding patterns associated with Parkinson disease progression.',
        status: 'In Progress',
        articleCount: 1,
      },
      {
        id: 'aim-3',
        order: 3,
        description:
          'Establish a biomarker panel for early detection of neurodegeneration through longitudinal cohort analysis.',
        status: 'Pending',
        articleCount: 0,
      },
      {
        id: 'aim-4',
        order: 4,
        description:
          'Evaluate the therapeutic potential of targeted gene therapy approaches in preclinical models of synucleinopathy.',
        status: 'Terminated',
        articleCount: 2,
      },
      {
        id: 'aim-5',
        order: 5,
        description:
          'Investigate the role of neuroinflammatory pathways in disease onset using single-cell transcriptomic profiling of microglia and astrocytes.',
        status: 'In Progress',
        articleCount: 0,
      },
    ],
  },
  {
    grantTitle: 'Supplement Grant',
    aims: [
      {
        id: 'aim-6',
        order: 1,
        description:
          'Validate candidate biomarkers identified in the original grant through an independent multi-site replication cohort.',
        status: 'In Progress',
        articleCount: 1,
      },
      {
        id: 'aim-7',
        order: 2,
        description:
          'Develop a scalable assay platform for clinical deployment of the validated biomarker panel.',
        status: 'Pending',
        articleCount: 0,
      },
    ],
  },
];

const styles = css({
  display: 'grid',
  gridRowGap: rem(36),
});

type ProjectDetailAboutProps = ProjectDetail & {
  readonly pointOfContactEmail?: string;
};

const ProjectDetailAbout: React.FC<ProjectDetailAboutProps> = (project) => {
  const { pointOfContactEmail } = project;
  const { isEnabled } = useFlags();

  return (
    <div css={styles}>
      {/* Overview Section */}
      <ProjectDetailOverview
        originalGrant={{
          originalGrant: project.originalGrant ?? '',
          proposalId: project.originalGrantProposalId,
        }}
        supplementGrant={project.supplementGrant}
      />

      {/* Tags Section */}
      {project.tags && project.tags.length > 0 && (
        <ProfileExpertiseAndResources
          hideExpertiseAndResources
          tags={project.tags.map((tag) => ({ id: tag, name: tag }))}
        />
      )}

      {/* Aims Section */}
      {isEnabled('PROJECT_AIMS') && <ProjectAims aims={DUMMY_AIMS_DATA} />}

      {/* Contributors Section */}
      {project.projectType === 'Discovery Project' && (
        <ProjectContributors
          fundedTeam={project.fundedTeam}
          collaborators={project.collaborators}
        />
      )}

      {project.projectType === 'Resource Project' &&
        project.isTeamBased &&
        project.fundedTeam && (
          <ProjectContributors
            fundedTeam={project.fundedTeam}
            collaborators={project.collaborators}
          />
        )}

      {project.projectType === 'Resource Project' &&
        !project.isTeamBased &&
        project.members && (
          <ProjectContributors projectMembers={project.members} />
        )}

      {project.projectType === 'Trainee Project' && (
        <ProjectContributors
          projectMembers={project.members}
          showTeamInfo={true}
        />
      )}

      {/* Contact CTA Card */}
      {pointOfContactEmail && project.status === 'Active' && (
        <CtaCard
          href={createMailTo(pointOfContactEmail)}
          buttonText="Contact"
          displayCopy
        >
          <strong>Have additional questions?</strong>
          <br /> Members are here to help.
        </CtaCard>
      )}
    </div>
  );
};

export default ProjectDetailAbout;
