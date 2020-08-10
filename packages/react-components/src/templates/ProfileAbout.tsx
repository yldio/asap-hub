import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { ProfileBiography, ProfileSkills } from '../organisms';
import { perRem, contentSidePaddingWithNavigation } from '../pixels';
import { pearl, steel } from '../colors';

const styles = css({
  backgroundColor: pearl.rgb,
  borderTop: `1px solid ${steel.rgb}`,

  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

interface ProfileAboutProps {
  biography?: ComponentProps<typeof ProfileBiography>['biography'];
  skills: ComponentProps<typeof ProfileSkills>['skills'];
}
const ProfileAbout: React.FC<ProfileAboutProps> = ({ biography, skills }) => (
  <main css={styles}>
    {biography && <ProfileBiography biography={biography} />}
    {skills.length ? <ProfileSkills skills={skills} /> : null}
  </main>
);

export default ProfileAbout;
