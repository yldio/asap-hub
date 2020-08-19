import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import {
  ProfileBiography,
  ProfileRecentWorks,
  SkillsSection,
} from '../organisms';
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
  skills: ComponentProps<typeof SkillsSection>['skills'];
  orcidWorks?: ComponentProps<typeof ProfileRecentWorks>['orcidWorks'];
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({
  biography,
  skills,
  orcidWorks,
}) => (
  <main css={styles}>
    {biography && <ProfileBiography biography={biography} />}
    {skills.length ? <SkillsSection skills={skills} /> : null}
    {orcidWorks && orcidWorks.length ? (
      <ProfileRecentWorks orcidWorks={orcidWorks} />
    ) : null}
  </main>
);

export default ProfileAbout;
