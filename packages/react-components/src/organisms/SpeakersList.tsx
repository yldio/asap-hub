import { css } from '@emotion/react';
import {
  EventSpeaker,
  EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
} from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseISO, addHours } from 'date-fns';
import { Headline3, Headline4, Avatar, Link } from '../atoms';
import { tabletScreen, perRem, mobileScreen } from '../pixels';
import { userPlaceholderIcon } from '../icons';
import { useDateHasPassed } from '../date';

const getPlaceholderAvatarUrl = () =>
  `data:image/svg+xml;base64,${btoa(
    renderToStaticMarkup(userPlaceholderIcon),
  )}`;

const gridStyles = css({
  display: 'grid',
  flexFlow: 'column',
  gap: `${15 / perRem}em`,
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    gap: 0,
  },
});

const userStyles = css({
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'min-content 1fr',
  gridColumnGap: `${6 / perRem}em`,
  alignItems: 'center',
});

const gridMixin = {
  display: 'grid',
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridAutoFlow: 'column',
    alignItems: 'start',
  },
};

const speakerListStyles = css({
  ...gridMixin,
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    gridAutoFlow: 'row',
    alignItems: 'start',
    borderBottom: '1px solid #DFE5EA',
    [`&:nth-of-type(n+4)`]: {
      display: 'none',
    },
  },
  [`&:nth-of-type(n+6)`]: {
    display: 'none',
  },
});

const headerStyle = css({
  ...gridMixin,
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    display: 'none',
  },
});

const labelStyle = css({
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridAutoFlow: 'column',
    alignItems: 'start',
    display: 'inline-block',
    fontWeight: 'bold',
  },
  display: 'none',
});

const groupStyle = css({
  display: 'flex',
  flexFlow: 'column',
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    paddingBottom: `${20 / perRem}em`,
    paddingTop: `${20 / perRem}em`,
  },
});

interface SpeakerListProps {
  speakers: EventSpeaker[];
  readonly endDate: string;
}

const SpeakerList: React.FC<SpeakerListProps> = ({ speakers, endDate }) => {
  const considerEndedAfter = addHours(
    parseISO(endDate),
    EVENT_CONSIDERED_PAST_HOURS_AFTER_EVENT,
  );

  const hasEnded = useDateHasPassed(considerEndedAfter);
  const userToBeAnnounced = hasEnded
    ? 'User was never announced'
    : 'To be announced';

  return (
    <div>
      <Headline3 styleAsHeading={3}>Speakers</Headline3>
      <div css={headerStyle}>
        <Headline4 styleAsHeading={4}>Team</Headline4>
        <Headline4 styleAsHeading={4}>Speaker</Headline4>
        <Headline4 styleAsHeading={4}>Role</Headline4>
      </div>
      <div css={gridStyles}>
        {speakers.map(({ user, team, role }) => (
          <div key={team.id + user?.id} css={speakerListStyles}>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Team</span>
              </div>
              <Link href={network({}).teams({}).team({ teamId: team.id }).$}>
                {team?.displayName}
              </Link>
            </div>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Speaker</span>
              </div>
              <div css={userStyles}>
                <Avatar
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  imageUrl={user?.displayName ? '' : getPlaceholderAvatarUrl()}
                />
                {(user?.displayName && (
                  <Link
                    href={
                      user && network({}).users({}).user({ userId: user?.id }).$
                    }
                  >
                    {user?.displayName}
                  </Link>
                )) || <span>{userToBeAnnounced}</span>}
              </div>
            </div>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Role</span>
              </div>
              <span>{role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakerList;
