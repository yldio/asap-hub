import { ArticleItem, ProjectDetail } from '@asap-hub/model';
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

const styles = css({
  display: 'grid',
  gridRowGap: rem(36),
});

type ProjectDetailAboutProps = ProjectDetail & {
  readonly pointOfContactEmail?: string;
  readonly fetchArticles: (
    aimId: string,
  ) => Promise<ReadonlyArray<ArticleItem>>;
  readonly seeMilestonesHref?: string;
};

const ProjectDetailAbout: React.FC<ProjectDetailAboutProps> = (project) => {
  const { pointOfContactEmail, fetchArticles, seeMilestonesHref } = project;
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
      {isEnabled('PROJECT_AIMS_AND_MILESTONES') && (
        <ProjectAims
          originalGrantAims={project.originalGrantAims ?? []}
          supplementGrantAims={project.supplementGrant?.aims ?? []}
          fetchArticles={fetchArticles}
          seeMilestonesHref={seeMilestonesHref}
        />
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
