import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { ProfileBiography, ProfileRecentWorks } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

export interface ProfileAboutProps {
  biography?: ComponentProps<typeof ProfileBiography>['biography'];
  biosketch?: ComponentProps<typeof ProfileBiography>['biosketch'];
  orcidWorks?: ComponentProps<typeof ProfileRecentWorks>['orcidWorks'];
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({
  biography,
  biosketch,
  orcidWorks,
}) => (
  <div css={styles}>
    {biography && (
      <ProfileBiography biosketch={biosketch} biography={biography} />
    )}
    {orcidWorks && orcidWorks.length ? (
      <ProfileRecentWorks orcidWorks={orcidWorks} />
    ) : null}
  </div>
);

export default ProfileAbout;
