import React from 'react';
import css from '@emotion/css';
import { UserResponse, UserTeam } from '@asap-hub/model';

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
  'department' | 'institution' | 'jobTitle' | 'location'
> & {
  readonly teams: ReadonlyArray<UserTeam & { href: string }>;
};

const ProfilePersonalText: React.FC<ProfilePersonalTextProps> = ({
  department,
  institution,
  location,
  jobTitle,
  teams,
}) => {
  return (
    <div css={mainTextStyles}>
      <Paragraph accent="lead">
        {jobTitle}
        {jobTitle && institution && ' at '}
        {institution}
        {institution && department && `, ${department}`}
        {teams.map(({ id, role, href, displayName }) => (
          <React.Fragment key={id}>
            <br />
            {role} on <Link href={href}>{displayName}</Link>
          </React.Fragment>
        ))}
      </Paragraph>
      {location && (
        <Paragraph accent="lead">
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
