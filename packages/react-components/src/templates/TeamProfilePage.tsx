import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import TeamProfileHeader from './TeamProfileHeader';
import { steel } from '../colors';
import { networkPageLayoutPaddingStyle } from '../layout';
import { Toast } from '../organisms';

const contentStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: networkPageLayoutPaddingStyle,
});

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
    <main css={contentStyles}>{children}</main>
  </article>
);

export default TeamProfilePage;
