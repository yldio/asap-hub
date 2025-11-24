import { ProjectDetail } from '@asap-hub/model';
import { css } from '@emotion/react';
import { rem } from '../pixels';
import {
  ProfileExpertiseAndResources,
  ProjectDetailOverview,
  ProjectMilestones,
  ProjectContributors,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';

const styles = css({
  display: 'grid',
  gridRowGap: rem(36),
});

type ProjectDetailAboutProps = ProjectDetail & {
  readonly pointOfContactEmail?: string;
};

const ProjectDetailAbout: React.FC<ProjectDetailAboutProps> = (project) => {
  const { pointOfContactEmail } = project;

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

      {/* Milestones Section */}
      {project.milestones && project.milestones.length > 0 && (
        <ProjectMilestones milestones={project.milestones} />
      )}

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
          projectMembers={[project.trainer, ...project.members]}
          showTeamInfo={true}
        />
      )}

      {/* Contact CTA Card */}
      {pointOfContactEmail && (
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
