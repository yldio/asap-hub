import React from 'react';
import css from '@emotion/css';
import { UserResponse } from '@asap-hub/model';

import { Link, Paragraph } from '../atoms';
import { locationIcon } from '../icons';
import { perRem, lineHeight } from '../pixels';

const mainTextStyles = css({
  paddingBottom: `${6 / perRem}em`,
});
const locationStyles = css({
  display: 'flex',
  alignItems: 'center',
});
const iconStyles = css({
  display: 'inline-block',
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,
  paddingRight: `${6 / perRem}em`,
});

type ProfilePersonalTextProps = Pick<
  UserResponse,
  'department' | 'institution' | 'jobTitle' | 'location' | 'teams'
> & {
  readonly teamProfileHref: string;
};

const ProfilePersonalText: React.FC<ProfilePersonalTextProps> = ({
  department,
  institution,
  location,
  jobTitle,
  teams,
  teamProfileHref,
}) => {
  const team = teams?.[0];
  return (
    <div css={mainTextStyles}>
      <Paragraph>
        {jobTitle}
        {jobTitle && institution && ' at '}
        {institution}
        {institution && department && `, ${department}`}
        {team && (
          <>
            <br />
            {team.role} on{' '}
            <Link href={teamProfileHref}>{team.displayName}</Link>
          </>
        )}
      </Paragraph>
      {location && (
        <Paragraph>
          <span css={locationStyles}>
            <span css={iconStyles}>{locationIcon}</span>
            {location}
          </span>
        </Paragraph>
      )}
    </div>
  );
};

export default ProfilePersonalText;
