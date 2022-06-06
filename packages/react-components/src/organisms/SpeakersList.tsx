import { css } from '@emotion/react';
import { EventSpeaker } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { useState } from 'react';
import { Headline3, Headline4, Avatar, Link, Button } from '../atoms';
import { tabletScreen, perRem, mobileScreen } from '../pixels';
import {
  userPlaceholderIcon,
  chevronCircleDownIcon,
  chevronCircleUpIcon,
} from '../icons';
import { useDateHasPassed } from '../date';
import { considerEndedAfter } from '../utils';
import { steel, lead, colorWithTransparency } from '../colors';

const gridStyles = css({
  display: 'grid',
  flexFlow: 'column',
  gap: `${15 / perRem}em`,
  [`@media (max-width: ${tabletScreen.width}px)`]: {
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

const headerStyle = css({
  ...gridMixin,
  [`@media (max-width: ${tabletScreen.width}px)`]: {
    display: 'none',
  },
});

const placeholderStyle = css({
  display: 'flex',
});

const labelStyle = css({
  [`@media (max-width: ${tabletScreen.width}px)`]: {
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
  [`@media (max-width: ${tabletScreen.width}px)`]: {
    paddingBottom: `${12 / perRem}em`,
    paddingTop: `${12 / perRem}em`,
  },
});

const toBeAnnouncedStyle = css({
  fontStyle: 'italic',
  color: `${lead}`,
});

const previewStyle = {
  maxHeight: `${69 / perRem}em`,
  overflow: 'hidden',
  background: `linear-gradient(180deg, ${lead.rgb} 26.56%, ${
    colorWithTransparency(lead, 0).rgba
  } 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent',
};

const speakerListMobileMixin = {
  gridAutoFlow: 'row',
  alignItems: 'start',
  borderBottom: `1px solid ${steel.rgb}`,
  paddingBottom: `${12 / perRem}em`,
  paddingTop: `${12 / perRem}em`,
};

const speakerListStyles = {
  ...gridMixin,
  [`@media (max-width: ${tabletScreen.width}px)`]: {
    ...speakerListMobileMixin,
    [`:nth-last-of-type(2)`]: { borderBottom: 'transparent' },
  },
};

const hideStyles = css({
  [`@media (max-width: ${tabletScreen.width}px)`]: {
    ...speakerListMobileMixin,
    [`:nth-of-type(4)`]: { ...previewStyle, borderBottom: 'transparent' },
    [`:nth-of-type(n+5)`]: { display: 'none' },
  },
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    ...gridMixin,
    borderBottom: 'transparent',
    [`:nth-of-type(n+6)`]: { ...previewStyle },
    [`:nth-of-type(n+7)`]: { display: 'none' },
  },
});

const buttonWrapperStyles = css({
  paddingBottom: `${21 / perRem}em`,
  marginBottom: `${21 / perRem}em`,
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  borderBottom: `1px solid ${steel.rgb}`,
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    borderBottom: `transparent`,
  },
});

interface SpeakerListProps {
  speakers: EventSpeaker[];
  readonly endDate: string;
}

const SpeakerList: React.FC<SpeakerListProps> = ({ speakers, endDate }) => {
  const [expanded, setExpanded] = useState(false);
  const isMobile = window.innerWidth < tabletScreen.width;
  const hasEnded = useDateHasPassed(considerEndedAfter(endDate));

  const userToBeAnnounced = hasEnded
    ? 'User was not announced'
    : 'User to be announced';
  const shouldRenderButton =
    (isMobile && speakers.length > 3) || (!isMobile && speakers.length > 5);

  return (
    <div
      css={{
        display: 'flex',
        flexFlow: 'column',
      }}
    >
      <Headline3 styleAsHeading={3}>Speakers</Headline3>
      <div css={headerStyle}>
        <Headline4 styleAsHeading={4}>Team</Headline4>
        <Headline4 styleAsHeading={4}>Speaker</Headline4>
        <Headline4 styleAsHeading={4}>Role</Headline4>
      </div>
      <div css={gridStyles}>
        {speakers.map((speaker, index) => (
          <div
            key={`speaker-id-${index}`}
            css={
              expanded
                ? speakerListStyles
                : { ...speakerListStyles, ...hideStyles }
            }
          >
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Team</span>
              </div>
              {'externalUser' in speaker ? (
                <span>External Speaker</span>
              ) : (
                <Link
                  href={
                    network({}).teams({}).team({ teamId: speaker.team.id }).$
                  }
                >
                  {speaker.team.displayName}
                </Link>
              )}
            </div>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Speaker</span>
              </div>
              <div css={userStyles}>
                {'user' in speaker ? (
                  <Avatar {...speaker.user} imageUrl={speaker.user.avatarUrl} />
                ) : (
                  <div css={placeholderStyle}>{userPlaceholderIcon}</div>
                )}
                {('user' in speaker && (
                  <Link
                    href={
                      network({}).users({}).user({ userId: speaker.user.id }).$
                    }
                  >
                    {speaker.user.displayName}
                  </Link>
                )) ||
                  ('externalUser' in speaker && (
                    <span>{speaker.externalUser.name}</span>
                  )) || (
                    <span css={toBeAnnouncedStyle}>{userToBeAnnounced}</span>
                  )}
              </div>
            </div>
            <div css={groupStyle}>
              <div css={labelStyle}>
                <span>Role</span>
              </div>
              <span>
                {('role' in speaker && speaker.role) ||
                  ('externalUser' in speaker && 'Guest') ||
                  `—`}
              </span>
            </div>
          </div>
        ))}
        {shouldRenderButton && (
          <div css={{ buttonWrapperStyles }}>
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
              <span
                css={{
                  display: 'inline-grid',
                  verticalAlign: 'middle',
                  paddingRight: `${12 / perRem}em`,
                }}
              >
                {expanded ? chevronCircleUpIcon : chevronCircleDownIcon}
              </span>
              Show {expanded ? 'less' : 'more'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakerList;
