import React, { FC, useContext } from 'react';
import { css } from '@emotion/react';
import { UserListItemResponse, UserTeam } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { UserProfileContext } from '@asap-hub/react-context';

import { Link, Ellipsis, Anchor, Subtitle } from '../atoms';
import { alumniBadgeIcon, locationIcon } from '../icons';
import { rem, lineHeight } from '../pixels';
import { lead, tin } from '../colors';
import {
  formatUserLocation,
  getUniqueCommaStringWithSuffix,
  splitListBy,
} from '../utils';
import TagList from './TagList';
import TooltipInfo from './TooltipInfo';
import { styles, getLinkColors } from '../atoms/Link';

const MAX_TEAMS = 2;

const locationStyles = css({
  padding: `${rem(6)} 0 ${rem(24)}`,
  display: 'flex',
  alignItems: 'center',
  color: lead.rgb,
});

const iconStyles = css({
  display: 'inline-block',
  width: rem(lineHeight),
  height: rem(lineHeight),
  paddingRight: rem(6),
});

const paragraphStyles = css({
  marginTop: 0,
  marginBottom: rem(18),
  color: lead.rgb,
});

const badgeStyles = css({
  lineHeight: rem(8),
  marginLeft: rem(8),
});

const tagsContainerStyles = css({
  paddingBottom: rem(12),
});

type UserProfilePersonalTextProps = Pick<
  UserListItemResponse,
  | 'institution'
  | 'jobTitle'
  | 'country'
  | 'stateOrProvince'
  | 'city'
  | 'labs'
  | 'tags'
> & { userActiveTeamsRoute?: string; isAlumni?: boolean; teams: UserTeam[] };
const UserProfilePersonalText: FC<UserProfilePersonalTextProps> = ({
  institution,
  country,
  stateOrProvince,
  city,
  jobTitle,
  teams,
  labs,
  tags,
  isAlumni,
}) => {
  const { isOwnProfile } = useContext(UserProfileContext);

  const labsList = getUniqueCommaStringWithSuffix(
    labs.map((lab) => lab.name),
    'Lab',
  );

  const [inactiveTeams, activeTeams] = splitListBy(
    teams,
    (team) =>
      isAlumni || !!team?.teamInactiveSince || !!team?.inactiveSinceDate,
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
        {teams.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            No team affiliation
            <TooltipInfo>
              Some members are not linked to a team because they work directly
              under a project.
            </TooltipInfo>
          </div>
        ) : (
          <>
            {activeTeams
              .slice(0, MAX_TEAMS)
              .map(({ id, role: teamRole, displayName }) => (
                <div style={{ display: 'flex' }} key={id}>
                  <div>{teamRole} on&nbsp;</div>
                  <Link href={network({}).teams({}).team({ teamId: id }).$}>
                    Team {displayName}
                  </Link>
                </div>
              ))}
            {activeTeams.length > MAX_TEAMS && (
              <Anchor
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  const teamsCard = document.getElementById(
                    'user-teams-tabbed-card',
                  );
                  if (teamsCard) {
                    teamsCard.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                css={(theme) => [styles, getLinkColors(theme.colors, 'light')]}
              >
                View all roles
              </Anchor>
            )}
            {inactiveTeams.length ? (
              <div
                css={css({
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: rem(16),
                })}
              >
                <Subtitle noMargin>Former Roles</Subtitle>
                <span css={badgeStyles}>{alumniBadgeIcon}</span>
              </div>
            ) : null}
            {inactiveTeams
              .slice(0, MAX_TEAMS)
              .map(({ id, role: teamRole, displayName }) => (
                <div style={{ display: 'flex' }} key={id}>
                  <div>{teamRole} on&nbsp;</div>
                  <Link href={network({}).teams({}).team({ teamId: id }).$}>
                    Team {displayName}
                  </Link>
                </div>
              ))}
            {inactiveTeams.length > MAX_TEAMS && (
              <Anchor
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  const teamsCard = document.getElementById(
                    'user-teams-tabbed-card',
                  );
                  if (teamsCard) {
                    teamsCard.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                css={(theme) => [styles, getLinkColors(theme.colors, 'light')]}
              >
                View all former roles
              </Anchor>
            )}
          </>
        )}
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
