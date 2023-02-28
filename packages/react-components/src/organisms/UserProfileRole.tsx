import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { UserResponse } from '@asap-hub/model';
import { UserProfileContext } from '@asap-hub/react-context';

import { Card, Headline2, Headline3 } from '../atoms';
import { perRem } from '../pixels';
import UserProfilePlaceholderCard from './UserProfilePlaceholderCard';

type UserProfileRoleProps = Pick<
  UserResponse,
  'firstName' | 'researchInterests' | 'responsibilities' | 'role' | 'reachOut'
>;

const detailsContentStyle = css({
  marginBottom: `${24 / perRem}em`,
});

const textStyle = css({
  margin: 0,
});

const UserProfileRole: React.FC<UserProfileRoleProps> = ({
  firstName,
  researchInterests,
  responsibilities,
  role,
  reachOut,
}) => {
  const { isOwnProfile } = useContext(UserProfileContext);
  return (
    <Card>
      <Headline2 styleAsHeading={3}>
        {firstName}'s Role on ASAP Network
      </Headline2>
      {(researchInterests || isOwnProfile) && role !== 'Staff' && (
        <div css={detailsContentStyle}>
          <Headline3 styleAsHeading={5}>Main Research Interests</Headline3>
          {researchInterests ? (
            <p css={textStyle}>{researchInterests}</p>
          ) : (
            <UserProfilePlaceholderCard title="What are your main research interests?">
              Tell the network what your main research interests are to easily
              find researchers with similar interests.
            </UserProfilePlaceholderCard>
          )}
        </div>
      )}
      {(responsibilities || isOwnProfile) && (
        <div css={detailsContentStyle}>
          <Headline3 styleAsHeading={5}>
            {firstName}'s Responsibilities
          </Headline3>
          {responsibilities ? (
            <p css={textStyle}>{responsibilities}</p>
          ) : (
            <UserProfilePlaceholderCard title="Which responsibilities do you have in your project?">
              Tell others about the role you play in your team. This will
              encourage collaboration.
            </UserProfilePlaceholderCard>
          )}
        </div>
      )}
      {(reachOut || isOwnProfile) && role === 'Staff' && (
        <div css={detailsContentStyle}>
          <Headline3 styleAsHeading={5}>
            Reach out to {firstName} for help with...
          </Headline3>
          {reachOut ? (
            <p css={textStyle}>{reachOut}</p>
          ) : (
            <UserProfilePlaceholderCard title="If at all, why should grantees ever need to contact you?">
              This will help the Hub to direct grantees to the right point of
              contact.
            </UserProfilePlaceholderCard>
          )}
        </div>
      )}
    </Card>
  );
};

export default UserProfileRole;
