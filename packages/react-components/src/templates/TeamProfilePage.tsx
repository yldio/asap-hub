import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { Link } from '../atoms';
import { Toast } from '../organisms';
import { rem } from '../pixels';
import { getProjectRoute } from '../utils';
import PageConstraints from './PageConstraints';
import TeamProfileHeader from './TeamProfileHeader';

const projectBannerStyles = css({
  paddingBottom: rem(36),
});

type TeamProfilePageProps = ComponentProps<typeof TeamProfileHeader> & {
  children?: React.ReactNode;
  showProjectBanner?: boolean;
  onDismissProjectBanner?: () => void;
};

const TeamProfilePage: React.FC<TeamProfilePageProps> = ({
  children,
  showProjectBanner = false,
  onDismissProjectBanner,
  ...profile
}) => {
  const { linkedProjectId, projectTitle, projectType } = profile;
  const projectLink =
    linkedProjectId && projectType
      ? getProjectRoute({ projectId: linkedProjectId, projectType })
      : undefined;

  return (
    <article>
      {!!profile.inactiveSince && (
        <Toast accent="warning">
          This team is inactive and might not have all content available.
        </Toast>
      )}
      <TeamProfileHeader {...profile} />
      <PageConstraints as="main">
        {showProjectBanner && projectLink && projectTitle && (
          <div css={projectBannerStyles}>
            <Toast accent="info" rounded onClose={onDismissProjectBanner}>
              The workspace and outputs have moved to the team&apos;s project.
              Go to <Link href={projectLink}>{projectTitle}</Link> to access
              them.
            </Toast>
          </div>
        )}
        {children}
      </PageConstraints>
    </article>
  );
};

export default TeamProfilePage;
