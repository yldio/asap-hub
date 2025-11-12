import { ComponentProps } from 'react';

import TeamProfileHeader from './TeamProfileHeader';
import { Toast } from '../organisms';
import PageContraints from './PageConstraints';

type TeamProfilePageProps = ComponentProps<typeof TeamProfileHeader>;

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
    <PageContraints as="main">{children}</PageContraints>
  </article>
);

export default TeamProfilePage;
