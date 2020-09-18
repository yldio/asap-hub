import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import { ProfileBackground, SkillsSection } from '../organisms';
import { UserResponse } from '../../../model/src';

const styles = css({
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
    <div css={styles}>
      {teams.length
        ? teams.map((team) => (
            <ProfileBackground key={team.id} {...team} firstName={firstName} />
          ))
        : null}
      {skills.length ? <SkillsSection skills={skills} /> : null}
    </div>
  );
};

export default ProfileAbout;
