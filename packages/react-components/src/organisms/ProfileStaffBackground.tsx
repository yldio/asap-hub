import React from 'react';
import css from '@emotion/css';
import { UserResponse } from '@asap-hub/model';

import { Card, Headline2, Headline3, Link, Paragraph } from '../atoms';
import { mobileScreen, perRem } from '../pixels';

type ProfileStaffBackgroundProps = Pick<UserResponse, 'firstName'> & {
  readonly discoverHref: string;
  readonly reachOut?: string;
  readonly responsibilities?: string;
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

const ProfileStaffBackground: React.FC<ProfileStaffBackgroundProps> = ({
  firstName,
  reachOut = '',
  responsibilities = '',
  discoverHref,
}) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>{firstName}'s Role on ASAP</Headline2>
      <div>
        <div css={dynamicContainerStyles}>
          <div css={teamContentStyle}>
            <Headline3 styleAsHeading={5}>Team</Headline3>
            <Link href={discoverHref}>Team ASAP</Link>
          </div>
          <div css={teamContentStyle}>
            <Headline3 styleAsHeading={5}>Role</Headline3>
            <Paragraph>ASAP Staff</Paragraph>
          </div>
        </div>
        {responsibilities && (
          <div>
            <Headline3 styleAsHeading={5}>
              {firstName}'s Responsibilities
            </Headline3>
            <Paragraph>{responsibilities}</Paragraph>
          </div>
        )}
        {reachOut && (
          <div>
            <Headline3 styleAsHeading={5}>
              Reach out to {firstName} if...
            </Headline3>
            <Paragraph>{reachOut}</Paragraph>
          </div>
        )}
      </div>
      <div css={linksContainer}>
        <Link buttonStyle href={discoverHref}>
          Meet the Team
        </Link>
      </div>
    </Card>
  );
};

export default ProfileStaffBackground;
