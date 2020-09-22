import React from 'react';
import css from '@emotion/css';
import { Card, Headline2, Headline3, Link, Paragraph } from '../atoms';
import { mobileScreen } from '../pixels';
import { UserResponse } from '../../../model/src';

type ProfileBackgroundProps = UserResponse['teams'][0] &
  Pick<UserResponse, 'firstName'>;

const dynamicContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'stretch',
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    flexDirection: 'column',
  },
});

const teamContentStyle = css({
  flex: 1,
});

const ProfileBackground: React.FC<ProfileBackgroundProps> = ({
  id,
  firstName,
  displayName,
  role,
  approach = '',
  responsibilities = '',
}) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>{firstName}'s Research</Headline2>
      <div>
        <div css={dynamicContainerStyles}>
          <div css={teamContentStyle}>
            <Headline3 styleAsHeading={4}>Team</Headline3>
            <Link href={`/network/teams/${id}`}>{displayName}</Link>
          </div>
          <div css={teamContentStyle}>
            <Headline3 styleAsHeading={4}>Role</Headline3>
            <Paragraph>{role}</Paragraph>
          </div>
        </div>
        {responsibilities && (
          <div>
            <Headline3 styleAsHeading={4}>
              {firstName}'s Responsibilities
            </Headline3>
            <Paragraph>{responsibilities}</Paragraph>
          </div>
        )}
        {approach && (
          <div>
            <Headline3 styleAsHeading={4}>Approach</Headline3>
            <Paragraph>{approach}</Paragraph>
          </div>
        )}
      </div>
      <div css={dynamicContainerStyles}>
        <Link href={`/network/teams/${id}`}>Meet the Team</Link>
      </div>
    </Card>
  );
};

export default ProfileBackground;
