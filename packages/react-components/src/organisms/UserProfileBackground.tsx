import React from 'react';
import css from '@emotion/css';
import { UserResponse, UserTeam } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';

import { Card, Headline2, Headline3, Link, Paragraph } from '../atoms';
import { mobileScreen, perRem } from '../pixels';

type UserProfileBackgroundProps = UserTeam & Pick<UserResponse, 'firstName'>;

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

const detailsContentStyle = css({
  marginBottom: `${24 / perRem}em`,
});

const textStyle = css({
  margin: 0,
});

const UserProfileBackground: React.FC<UserProfileBackgroundProps> = ({
  id,
  displayName,
  role,
  approach = '',
  responsibilities = '',
  proposal,

  firstName,
}) => {
  const teamHref = network({}).teams({}).team({ teamId: id }).$;

  return (
    <Card>
      <Headline2 styleAsHeading={3}>
        {firstName}'s Role on ASAP Network
      </Headline2>
      <div>
        <div css={dynamicContainerStyles}>
          <div css={teamContentStyle}>
            <Headline3 styleAsHeading={5}>Team</Headline3>
            <Link href={teamHref}>Team {displayName}</Link>
          </div>
          <div css={teamContentStyle}>
            <Headline3 styleAsHeading={5}>Role</Headline3>
            <p>{role}</p>
          </div>
        </div>
        {approach && (
          <div css={detailsContentStyle}>
            <Headline3 styleAsHeading={5}>Main Research Interests</Headline3>
            <p css={textStyle}>{approach}</p>
          </div>
        )}
        {responsibilities && (
          <div css={detailsContentStyle}>
            <Headline3 styleAsHeading={5}>
              {firstName}'s Responsibilities
            </Headline3>
            <p css={textStyle}>{responsibilities}</p>
          </div>
        )}
      </div>
      <div css={linksContainer}>
        {proposal ? (
          <Link
            buttonStyle
            primary
            href={
              sharedResearch({}).researchOutput({
                researchOutputId: proposal,
              }).$
            }
          >
            Read Team Proposal
          </Link>
        ) : null}
        <Link buttonStyle href={teamHref}>
          Meet the Team
        </Link>
      </div>
    </Card>
  );
};

export default UserProfileBackground;
