import { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { EventResponse, EventSpeakerTeam } from '@asap-hub/model';
import { events, network } from '@asap-hub/routing';

import { Headline3, Link, Anchor } from '../atoms';
import { lead } from '../colors';
import { perRem, largeDesktopScreen } from '../pixels';
import { groupsIcon, eventPlaceholderIcon, speakerIcon } from '../icons';
import { AssociationList, EventTime, TagList } from '.';

const TITLE_LIMIT = 55;

const imageContainerStyle = css({
  flexShrink: 0,
  borderRadius: `${6 / perRem}em`,
  height: `${102 / perRem}em`,
  marginRight: `${24 / perRem}em`,
  marginTop: `${12 / perRem}em`,
  width: `${102 / perRem}em`,
  overflow: 'hidden',

  [`@media (max-width: ${largeDesktopScreen.min}px)`]: {
    display: 'none',
  },
});

const cardStyles = css({
  display: 'flex',
  flexDirection: 'row',
});

const listItemStyles = css({
  padding: `${7.5 / perRem}em 0`,
  color: lead.rgb,
  whiteSpace: 'break-spaces',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: `${17 / perRem}em`,
  display: 'flex',
});
const widthStyles = css({
  display: 'grid',
});

const imageStyle = css({
  objectFit: 'cover',
  width: '100%',
  height: '100%',
});

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${9 / perRem}em`,
});

type EventInfoProps = ComponentProps<typeof EventTime> &
  Pick<
    EventResponse,
    'id' | 'title' | 'thumbnail' | 'group' | 'status' | 'speakers' | 'tags'
  > & {
    titleLimit?: number | null;
    showNumberOfSpeakers?: boolean;
    showTeams?: boolean;
  };

const EventTeams: React.FC<{ speakers: EventResponse['speakers'] }> = ({
  speakers,
}) => {
  const teams: EventSpeakerTeam['team'][] = speakers.reduce((acc, speaker) => {
    if ('team' in speaker && !acc.some((team) => team.id === speaker.team.id)) {
      return [...acc, speaker.team];
    }

    return acc;
  }, [] as EventSpeakerTeam['team'][]);

  if (teams.length === 0) {
    return null;
  }

  return (
    <div css={listItemStyles}>
      <AssociationList
        type="Team"
        inline
        associations={teams.slice(0, 7)}
        more={teams.length > 7 ? teams.length - 7 : undefined}
      />
    </div>
  );
};

const EventSpeakers: React.FC<{ speakers: EventResponse['speakers'] }> = ({
  speakers,
}) => {
  const numberOfSpeakers = speakers.filter(
    (speaker) => 'user' in speaker || 'externalUser' in speaker,
  ).length;

  if (numberOfSpeakers === 0) {
    return null;
  }

  return (
    <div css={listItemStyles}>
      <span css={iconStyles}>{speakerIcon}</span> {numberOfSpeakers} Speaker
      {numberOfSpeakers === 1 ? '' : 's'}
    </div>
  );
};

const EventInfo: React.FC<EventInfoProps> = ({
  id,
  title,
  thumbnail,
  group,
  status,
  titleLimit = TITLE_LIMIT,
  showNumberOfSpeakers = false,
  showTeams = false,
  tags,
  ...props
}) => {
  const imageComponent = thumbnail ? (
    <img alt={`Thumbnail for "${title}"`} src={thumbnail} css={imageStyle} />
  ) : (
    eventPlaceholderIcon
  );

  return (
    <div css={cardStyles}>
      <div css={imageContainerStyle}>{imageComponent}</div>
      <div>
        <Anchor
          href={
            status === 'Cancelled'
              ? undefined
              : events({}).event({ eventId: id }).$
          }
        >
          <Headline3 styleAsHeading={4}>
            {title.substr(0, titleLimit ?? undefined)}
            {titleLimit && title.length > titleLimit ? '…' : undefined}
          </Headline3>
        </Anchor>
        <EventTime {...props} />
        <div css={widthStyles}>
          <div css={listItemStyles}>
            {group ? (
              <Link
                href={network({}).groups({}).group({ groupId: group.id }).$}
              >
                <span css={iconStyles}>{groupsIcon}</span>
                {group.name}
              </Link>
            ) : (
              <>
                <span css={iconStyles}>{groupsIcon}</span>ASAP Event
              </>
            )}
          </div>
          {showTeams && <EventTeams speakers={props.speakers} />}
          {showNumberOfSpeakers && <EventSpeakers speakers={props.speakers} />}
          {tags.length > 0 && (
            <div css={listItemStyles}>
              <TagList tags={tags} max={3} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventInfo;
