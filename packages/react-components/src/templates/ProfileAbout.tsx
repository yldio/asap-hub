import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { ProfileBiography, ProfileRecentWorks } from '../organisms';
import { perRem } from '../pixels';
import { pearl, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  backgroundColor: pearl.rgb,
  borderTop: `1px solid ${steel.rgb}`,

  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

interface ProfileAboutProps {
  biography?: ComponentProps<typeof ProfileBiography>['biography'];
  orcidWorks?: ComponentProps<typeof ProfileRecentWorks>['orcidWorks'];
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({
  biography,
  orcidWorks,
}) => (
  <main css={styles}>
    {biography && <ProfileBiography biography={biography} />}
    {orcidWorks && orcidWorks.length ? (
      <ProfileRecentWorks orcidWorks={orcidWorks} />
    ) : null}
  </main>
);

export default ProfileAbout;
