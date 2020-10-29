import React from 'react';
import css from '@emotion/css';
import { UserResponse } from '@asap-hub/model';

import { Card, Headline2, Headline3, Link, Paragraph } from '../atoms';
import { mobileScreen, perRem } from '../pixels';

type ProfileBackgroundProps = UserResponse['teams'][0] &
  Pick<UserResponse, 'firstName'> & {
    readonly proposalHref?: string;
    readonly href: string;
  };

const dynamicContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'stretch',
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    flexDirection: 'column',
  },
});

const linksContainer = css({
  display: 'grid',

  gridColumnGap: `${30 / perRem}em`,
  justifyContent: 'stretch',

  [`@media (min-width: ${mobileScreen.max}px)`]: {
    grid: '"1fr 1fr"',
    justifyContent: 'flex-start',
  },
});

const teamContentStyle = css({
  flex: 1,
});

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({
  firstName,
  displayName,
  role,
  approach = '',
  responsibilities = '',
  proposalHref,
  href,
}) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>{firstName}'s Role on ASAP</Headline2>
      <div>
        <div css={dynamicContainerStyles}>
          <div css={teamContentStyle}>
            <Headline3 styleAsHeading={5}>Team</Headline3>
            <Link href={href}>Team {displayName}</Link>
          </div>
          <div css={teamContentStyle}>
            <Headline3 styleAsHeading={5}>Role</Headline3>
            <Paragraph>{role}</Paragraph>
          </div>
        </div>
        {approach && (
          <div>
            <Headline3 styleAsHeading={5}>Main Research Interests</Headline3>
            <Paragraph>{approach}</Paragraph>
          </div>
        )}
        {responsibilities && (
          <div>
            <Headline3 styleAsHeading={5}>
              {firstName}'s Responsibilities
            </Headline3>
            <Paragraph>{responsibilities}</Paragraph>
          </div>
        )}
      </div>
      <div css={linksContainer}>
        {proposalHref ? (
          <Link buttonStyle primary href={proposalHref}>
            Read Team Proposal
          </Link>
        ) : null}
        <Link buttonStyle href={href}>
          Meet the Team
        </Link>
      </div>
    </Card>
  );
};

export default ProfileBackground;
