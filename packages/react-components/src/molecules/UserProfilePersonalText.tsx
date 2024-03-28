import { FC, useContext } from 'react';
import { css } from '@emotion/react';
import { UserListItemResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { UserProfileContext } from '@asap-hub/react-context';

import { Link, Ellipsis, Avatar, Anchor } from '../atoms';
import { locationIcon } from '../icons';
import { perRem, lineHeight, rem, tabletScreen } from '../pixels';
import { lead, tin } from '../colors';
import { formatUserLocation, getUniqueCommaStringWithSuffix } from '../utils';
import TagList from './TagList';

const MAX_TEAMS = 3;
const avatarSize = 24;

const locationStyles = css({
  padding: `${6 / perRem}em 0 ${24 / perRem}em`,
  display: 'flex',
  alignItems: 'center',
  color: lead.rgb,
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

const avatarStyles = css({
  width: rem(avatarSize),
  height: rem(avatarSize),
  margin: 0,
  marginLeft: `${6 / perRem}em`,
  fontWeight: 700,
  fontSize: `${20 / perRem}em`,
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    margin: 'auto',
  },
});

const tagsContainerStyles = css({
  paddingBottom: `${12 / perRem}em`,
});

type UserProfilePersonalTextProps = Pick<
  UserListItemResponse,
  | 'institution'
  | 'jobTitle'
  | 'country'
  | 'stateOrProvince'
  | 'city'
  | 'teams'
  | 'labs'
  | 'tags'
> & { userActiveTeamsRoute?: string };
const UserProfilePersonalText: FC<UserProfilePersonalTextProps> = ({
  institution,
  country,
  stateOrProvince,
  city,
  jobTitle,
  teams,
  labs,
  userActiveTeamsRoute,
  tags,
}) => {
  const { isOwnProfile } = useContext(UserProfileContext);

  const labsList = getUniqueCommaStringWithSuffix(
    labs.map((lab) => lab.name),
    'Lab',
  );

  return (
    <div>
      <div css={paragraphStyles}>
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

        {!!labsList.length && (
          <>
            <br />
            <span>{labsList}</span>
          </>
        )}
        {teams
          .slice(0, MAX_TEAMS)
          .map(({ id, role: teamRole, displayName }, idx) => (
            <div style={{ display: 'flex' }} key={id}>
              <div>{teamRole} on&nbsp;</div>
              <Link href={network({}).teams({}).team({ teamId: id }).$}>
                Team {displayName}
              </Link>
              {idx === MAX_TEAMS - 1 && teams.length > MAX_TEAMS && (
                <span css={css({ gridRow: 1, gridColumn: 1 })}>
                  <Anchor href={userActiveTeamsRoute}>
                    <Avatar
                      placeholder={`+${teams.length - MAX_TEAMS}`}
                      overrideStyles={avatarStyles}
                    />
                  </Anchor>
                </span>
              )}
            </div>
          ))}
      </div>
      {(country || stateOrProvince || city || isOwnProfile) && (
        <span css={locationStyles}>
          <span css={iconStyles}>{locationIcon}</span>
          {country || stateOrProvince || city ? (
            <Ellipsis>
              {formatUserLocation(city, stateOrProvince, country)}
            </Ellipsis>
          ) : (
            <span css={{ color: tin.rgb }}>Add your location</span>
          )}
        </span>
      )}
      {tags?.length ? (
        <div css={tagsContainerStyles}>
          <TagList max={3} tags={tags.map((tag) => tag.name)} />
        </div>
      ) : null}
    </div>
  );
};

export default UserProfilePersonalText;
