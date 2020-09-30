import React from 'react';
import css from '@emotion/css';
import { ResearchOutputResponse } from '@asap-hub/model';
import format from 'date-fns/format';

import { TagLabel, Link, Paragraph, Card, Caption, Headline3 } from '../atoms';
import { RichText } from '../organisms';
import { lead } from '../colors';
import {
  perRem,
  mobileScreen,
  largeDesktopScreen,
  vminLinearCalc,
} from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { teamIcon, chevronCircleLeftIcon } from '../icons';

const teamMemberStyles = css({
  color: lead.rgb,
  display: 'flex',
  alignItems: 'center',
  paddingTop: `${12 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${15 / perRem}em`,
});

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const backContainerStyles = css({
  alignSelf: 'flex-start',
  padding: `${30 / perRem}em 0 `,
});

const backButtonStyles = css({
  display: 'flex',
  alignItems: 'center',
});

const cardPaddingStyles = css({
  padding: `${24 / perRem}em ${vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    36,
    'px',
  )}`,
});

const visibilityStyles = css({
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${30 / perRem}em`,
});

const postedStyles = css({
  color: lead.rgb,
});

type ResearchOutputPageProps = Pick<
  ResearchOutputResponse,
  'publishDate' | 'title' | 'type' | 'created' | 'team' | 'text'
> & {
  team?: {
    href: string;
  };
  profileHref: string;
  libraryHref: string;
};

const ResearchOutputPage: React.FC<ResearchOutputPageProps> = ({
  title,
  text,
  team,
  publishDate,
  created,
  profileHref,
  libraryHref,
}) => (
  <div css={containerStyles}>
    <div css={backContainerStyles}>
      <Link href={libraryHref}>
        <div css={backButtonStyles}>
          <span css={iconStyles}>{chevronCircleLeftIcon}</span> Back
        </div>
      </Link>
    </div>
    <Card padding={false}>
      <div css={cardPaddingStyles}>
        <TagLabel>Proposal</TagLabel>
        <Headline3 styleAsHeading={1}>{title}</Headline3>
        {team && (
          <span css={teamMemberStyles}>
            <span css={iconStyles}>{teamIcon} </span>
            <Link href={team.href}>{team.displayName}</Link>
          </span>
        )}
        <RichText toc text={text} />
        <div css={visibilityStyles}>
          <Paragraph>
            <strong>Visibility</strong>
            <br />
            Everyone in the ASAP Network
          </Paragraph>
        </div>
        <div css={postedStyles}>
          <Caption asParagraph>
            Posted:
            {format(new Date(publishDate || created), ' Mo MMMM yyyy')} by{' '}
            <Link href={profileHref}> ASAP ADMIN</Link>
          </Caption>
        </div>
      </div>
    </Card>
  </div>
);

export default ResearchOutputPage;
