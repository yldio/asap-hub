import { css } from '@emotion/react';
import { EventSpeaker } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { isInternalEventUser } from '@asap-hub/validation';
import { Headline3, Headline4, Avatar, Link } from '../atoms';
import { tabletScreen, perRem, mobileScreen } from '../pixels';
import { userPlaceholderIcon } from '../icons';
import { useDateHasPassed } from '../date';
import { considerEndedAfter } from '../utils';
import { steel, lead } from '../colors';

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
  gridColumnGap: `${15 / perRem}em`,
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
    borderBottom: `1px solid ${steel.rgb}`,
  },
});

const headerStyle = css({
  ...gridMixin,
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    display: 'none',
  },
});

const placeholderStyle = css({
  display: 'flex',
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
    paddingBottom: `${21 / perRem}em`,
    paddingTop: `${21 / perRem}em`,
  },
});

const toBeAnnouncedStyle = css({
  fontStyle: 'italic',
  color: `${lead}`,
});

interface SpeakerListProps {
  speakers: EventSpeaker[];
  readonly endDate: string;
}

const SpeakerList: React.FC<SpeakerListProps> = ({ speakers, endDate }) => {
  const hasEnded = useDateHasPassed(considerEndedAfter(endDate));
  const userToBeAnnounced = hasEnded
    ? 'User was not announced'
    : 'User to be announced';

  return (
    <div>
      <Headline3 styleAsHeading={3}>Speakers</Headline3>
      <div css={headerStyle}>
        <Headline4 styleAsHeading={4}>Team</Headline4>
        <Headline4 styleAsHeading={4}>Speaker</Headline4>
        <Headline4 styleAsHeading={4}>Role</Headline4>
      </div>
      <div css={gridStyles}>
        {speakers.map(({ user, team, role }, index) => (
          <div key={`speaker-id-${index}`} css={speakerListStyles}>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Team</span>
              </div>
              <Link href={network({}).teams({}).team({ teamId: team.id }).$}>
                {team.displayName}
              </Link>
            </div>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Speaker</span>
              </div>
              <div css={userStyles}>
                {isInternalEventUser(user) ? (
                  <Avatar {...user} imageUrl={user.avatarUrl} />
                ) : (
                  <div css={placeholderStyle}>{userPlaceholderIcon}</div>
                )}
                {(isInternalEventUser(user) && (
                  <Link
                    href={network({}).users({}).user({ userId: user.id }).$}
                  >
                    {user.displayName}
                  </Link>
                )) || <span css={toBeAnnouncedStyle}>{userToBeAnnounced}</span>}
              </div>
            </div>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Role</span>
              </div>
              <span>{role || `—`}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakerList;
