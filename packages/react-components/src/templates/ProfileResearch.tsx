import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import { pearl, steel } from '../colors';
import { ProfileBackground, SkillsSection } from '../organisms';
import { UserResponse } from '../../../model/src';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  backgroundColor: pearl.rgb,
  borderTop: `1px solid ${steel.rgb}`,

  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
  display: 'grid',
  gridRowGap: `${36 / perRem}em`,
});

type ProfileInterestProps = Pick<
  ComponentProps<typeof ProfileBackground>,
  'firstName'
> & {
  readonly teams: ReadonlyArray<
    Omit<ComponentProps<typeof ProfileBackground>, 'firstName'>
  >;
  readonly skills: UserResponse['skills'];
};

const ProfileAbout: React.FC<ProfileInterestProps> = ({
  firstName,
  teams,
  skills,
}) => {
  return (
    <main css={styles}>
      {teams.length
        ? teams.map((team) => (
            <ProfileBackground key={team.id} {...team} firstName={firstName} />
          ))
        : null}
      {skills.length ? <SkillsSection skills={skills} /> : null}
    </main>
  );
};

export default ProfileAbout;
