import { ComponentProps } from 'react';

import TeamProfileHeader from './TeamProfileHeader';
import { Toast } from '../organisms';
import PageConstraints from './PageConstraints';

type TeamProfilePageProps = ComponentProps<typeof TeamProfileHeader> & {
  children?: React.ReactNode;
};

const TeamProfilePage: React.FC<TeamProfilePageProps> = ({
  children,
  ...profile
}) => (
  <article>
    {!!profile.inactiveSince && (
      <Toast accent="warning">
        This team is inactive and might not have all content available.
      </Toast>
    )}
    <TeamProfileHeader {...profile} />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default TeamProfilePage;
