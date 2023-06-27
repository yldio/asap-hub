import React, { FC } from 'react';
import { css } from '@emotion/react';
import { network } from '@asap-hub/routing';

import {
  LabIcon,
  TeamIcon,
  inactiveBadgeIcon,
  WorkingGroupsIcon,
} from '../icons';
import { Avatar, Link } from '../atoms';
import { perRem } from '../pixels';
import { lead, silver } from '../colors';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
});

const inlineContainerStyles = css({
  display: 'unset',
  padding: 0,
});

const itemStyles = css({
  borderBottom: `1px solid ${silver.rgb}`,
  paddingBottom: `${24 / perRem}em`,
  paddingTop: `${24 / perRem}em`,
  color: lead.rgb,

  '&:first-of-type': {
    paddingTop: `${18 / perRem}em`,
  },
});

const inlineItemStyles = css({
  display: 'inline',
  borderBottom: 'none',
  padding: '0',
});

const bulletStyles = css({
  padding: `0 ${6 / perRem}em`,
  'li:last-of-type > &': {
    display: 'none',
  },
});

const iconStyles = css({
  verticalAlign: 'middle',
  display: 'inline-block',
  height: `${24 / perRem}em`,
  marginRight: `${9 / perRem}em`,
});

const inactiveBadgeStyles = css({
  lineHeight: `${18 / perRem}em`,
  verticalAlign: 'middle',
  marginLeft: `${8 / perRem}em`,
});

const moreStyles = css({
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr',
  gridColumnGap: `${6 / perRem}em`,
  alignItems: 'center',
});

const avatarStyles = css({
  fontSize: `${20 / perRem}em`,
});
const nameStyles = css({
  fontSize: `${17 / perRem}em`,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

interface AssociationListProps {
  readonly associations: ReadonlyArray<{
    displayName: string;
    id: string;
    inactiveSince?: string;
  }>;
  readonly type: 'Team' | 'Lab' | 'Working Group';
  readonly inline?: boolean;
  readonly max?: number;
  readonly more?: number;
}
const icon: Record<AssociationListProps['type'], React.ReactElement> = {
  Lab: <LabIcon />,
  Team: <TeamIcon />,
  'Working Group': <WorkingGroupsIcon />,
};
const Indicator = ({ type }: { type: AssociationListProps['type'] }) => (
  <div css={iconStyles}>{icon[type]}</div>
);

const AssociationList: FC<AssociationListProps> = ({
  associations,
  type,
  max = Number.POSITIVE_INFINITY,
  inline = false,
  more,
}) => {
  const limitExceeded = associations.length > max;

  if (!associations.length) {
    return null;
  }

  if (limitExceeded) {
    return (
      <div>
        <Indicator type={type} />
        {associations.length} {type}
        {associations.length === 1 ? '' : 's'}
      </div>
    );
  }

  return (
    <div>
      {inline && <Indicator type={type} />}
      <ul css={[containerStyles, inline && inlineContainerStyles]}>
        {associations.map(({ displayName, id, inactiveSince }) => (
          <li key={id} css={[itemStyles, inline && inlineItemStyles]}>
            {inline || <Indicator type={type} />}
            {type === 'Team' && (
              <>
                <Link href={network({}).teams({}).team({ teamId: id }).$}>
                  {type} {displayName}
                </Link>
                {inactiveSince && (
                  <span css={inactiveBadgeStyles}>{inactiveBadgeIcon}</span>
                )}
              </>
            )}
            {type === 'Lab' && (
              <>
                {displayName} {type}
              </>
            )}
            {type === 'Working Group' && (
              <Link
                href={
                  network({})
                    .workingGroups({})
                    .workingGroup({ workingGroupId: id }).$
                }
              >
                {displayName}
              </Link>
            )}
            {inline && <span css={bulletStyles}>·</span>}
          </li>
        ))}
        {more && (
          <div css={moreStyles}>
            <div css={avatarStyles}>
              <Avatar placeholder={`+${more}`} />
            </div>
            <span css={nameStyles}>
              {type}
              {more === 1 ? '' : 's'}
            </span>
          </div>
        )}
      </ul>
    </div>
  );
};

export default AssociationList;
