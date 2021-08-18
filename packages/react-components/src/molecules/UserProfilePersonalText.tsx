import { FC, Fragment, useContext } from 'react';
import { css } from '@emotion/react';
import { UserResponse } from '@asap-hub/model';
import { discover, network } from '@asap-hub/routing';
import { UserProfileContext } from '@asap-hub/react-context';

import { Link, Paragraph, Ellipsis } from '../atoms';
import UserProfileLabText from './UserProfileLabText';
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
  'institution' | 'jobTitle' | 'country' | 'city' | 'teams' | 'role' | 'labs'
>;
const UserProfilePersonalText: FC<UserProfilePersonalTextProps> = ({
  institution,
  country,
  city,
  jobTitle,
  teams,
  role,
  labs = [],
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
        {!!labs.length && (
          <>
            <br />
            <UserProfileLabText labs={labs} />
          </>
        )}
        {teams.map(({ id, role: teamRole, displayName }) => (
          <Fragment key={id}>
            <br />
            {teamRole} on{' '}
            <Link href={network({}).teams({}).team({ teamId: id }).$}>
              Team {displayName}
            </Link>
          </Fragment>
        ))}
      </p>
      {(country || city || isOwnProfile) && (
        <Paragraph accent="lead">
          <span css={locationStyles}>
            <span css={iconStyles}>{locationIcon}</span>
            {country || city ? (
              <Ellipsis>
                {city}
                {city && country && ','} {country}
              </Ellipsis>
            ) : (
              <span css={{ color: tin.rgb }}>Add your location</span>
            )}
          </span>
        </Paragraph>
      )}
    </div>
  );
};

export default UserProfilePersonalText;
