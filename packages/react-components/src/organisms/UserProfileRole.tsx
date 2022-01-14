import React, { Fragment, useContext } from 'react';
import { css } from '@emotion/react';
import { UserResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { UserProfileContext } from '@asap-hub/react-context';

import { Card, Divider, Headline2, Headline3, Link } from '../atoms';
import { perRem, tabletScreen } from '../pixels';
import UserProfilePlaceholderCard from './UserProfilePlaceholderCard';
import { getUniqueCommaStringWithSuffix } from '../utils';

type UserProfileRoleProps = Pick<
  UserResponse,
  | 'firstName'
  | 'teams'
  | 'researchInterests'
  | 'responsibilities'
  | 'role'
  | 'reachOut'
  | 'labs'
>;

const containerStyle = css({
  display: 'grid',

  gridColumnGap: `${12 / perRem}em`,

  margin: 0,
  marginTop: `${24 / perRem}em`,

  padding: 0,
  listStyle: 'none',
});

const titleStyle = css({
  fontWeight: 'bold',
});

const listItemStyle = css({
  display: 'grid',

  gridTemplateColumns: '1fr',
  gridTemplateRows: '1fr 1fr',
  gridRowGap: `${12 / perRem}em`,

  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridAutoFlow: 'column',
    gridTemplateColumns: '1fr 1fr',

    '&:not(:first-of-type)': {
      gridTemplateRows: '1fr',
    },

    [`&:not(:first-of-type) > :nth-child(odd)`]: {
      display: 'none',
    },
  },
});

const detailsContentStyle = css({
  marginBottom: `${24 / perRem}em`,
});

const textStyle = css({
  margin: 0,
});

const UserProfileRole: React.FC<UserProfileRoleProps> = ({
  teams,
  labs = [],
  firstName,
  researchInterests,
  responsibilities,
  role,
  reachOut,
}) => {
  const teamHref = (id: string) => network({}).teams({}).team({ teamId: id }).$;
  const { isOwnProfile } = useContext(UserProfileContext);
  const labsList = getUniqueCommaStringWithSuffix(
    labs.map((lab) => lab.name),
    'Lab',
  );
  return (
    <Card>
      <Headline2 styleAsHeading={3}>
        {firstName}'s Role on ASAP Network
      </Headline2>

      {!!teams.length && (
        <div css={detailsContentStyle}>
          <ul css={containerStyle}>
            {teams.map(({ displayName, role, id }, idx) => (
              <Fragment key={`team-${idx}`}>
                {idx === 0 || <Divider />}
                <li key={idx} css={listItemStyle}>
                  <div css={[titleStyle]}>Team</div>
                  <Link href={teamHref(id)}>Team {displayName}</Link>
                  <div css={[titleStyle]}>Role</div>
                  <div>{role}</div>
                </li>
              </Fragment>
            ))}
          </ul>
        </div>
      )}
      {!!labsList.length && (
        <div css={detailsContentStyle}>
          <Headline3 styleAsHeading={5}>Labs</Headline3>
          <span>{labsList}</span>
        </div>
      )}
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
