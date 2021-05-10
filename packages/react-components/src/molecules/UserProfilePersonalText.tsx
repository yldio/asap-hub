import React, { useContext } from 'react';
import css from '@emotion/css';
import { UserResponse } from '@asap-hub/model';
import { discover, network } from '@asap-hub/routing';
import { UserProfileContext } from '@asap-hub/react-context';

import { Link, Paragraph } from '../atoms';
import { locationIcon } from '../icons';
import { perRem, lineHeight } from '../pixels';
import { lead, tin } from '../colors';

const locationStyles = css({
  padding: `${6 / perRem}em 0`,

  display: 'flex',
  alignItems: 'center',
});

const iconStyles = css({
  display: 'inline-block',
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,
  paddingRight: `${6 / perRem}em`,
});

const paragraphStyles = css({
  marginTop: 0,
  marginBottom: `${18 / perRem}em`,
  color: lead.rgb,
});

type UserProfilePersonalTextProps = Pick<
  UserResponse,
  'institution' | 'jobTitle' | 'location' | 'teams' | 'role'
>;
const UserProfilePersonalText: React.FC<UserProfilePersonalTextProps> = ({
  institution,
  location,
  jobTitle,
  teams,
  role,
}) => {
  const { isOwnProfile } = useContext(UserProfileContext);
  return (
    <div>
      <p css={paragraphStyles}>
        {jobTitle || institution ? (
          <>
            {jobTitle}
            {jobTitle && institution && ' at '}
            {institution}
          </>
        ) : isOwnProfile ? (
          <span css={{ color: tin.rgb }}>
            Where do you work and what’s your position?
          </span>
        ) : null}

        {role === 'Staff' ? (
          <>
            <br />
            ASAP Staff on <Link href={discover({}).$}>Team ASAP</Link>
          </>
        ) : null}
        {teams.map(({ id, role: teamRole, displayName }) => (
          <React.Fragment key={id}>
            <br />
            {teamRole} on{' '}
            <Link href={network({}).teams({}).team({ teamId: id }).$}>
              Team {displayName}
            </Link>
          </React.Fragment>
        ))}
      </p>
      {(location || isOwnProfile) && (
        <Paragraph accent="lead">
          <span css={locationStyles}>
            <span css={iconStyles}>{locationIcon}</span>
            {location ?? (
              <span css={{ color: tin.rgb }}>Add your location</span>
            )}
          </span>
        </Paragraph>
      )}
    </div>
  );
};

export default UserProfilePersonalText;
