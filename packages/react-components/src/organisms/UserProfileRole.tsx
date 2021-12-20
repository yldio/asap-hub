import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { UserResponse, Lab } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { UserProfileContext } from '@asap-hub/react-context';

import { Card, Divider, Headline2, Headline3, Link } from '../atoms';
import { perRem } from '../pixels';
import UserProfilePlaceholderCard from './UserProfilePlaceholderCard';
import { getUniqueCommaStringWithSuffix } from '../utils';

type UserProfileRoleProps = Pick<
  UserResponse,
  'firstName' | 'teams' | 'researchInterests' | 'responsibilities'
> & {
  labs?: Lab[];
};

const dynamicContainerStyles = css({
  display: 'grid',
  gridTemplateColumns: ' 1fr 1fr',
  marginBottom: `${24 / perRem}em`,
});
const gridRowStyle = css({
  gridColumn: '1 / -1',
  display: 'flex',
});
const gridDividerStyle = css({
  gridColumn: '1 / -1',
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

const UserProfileRole: React.FC<UserProfileRoleProps> = ({
  teams,
  labs = [],
  firstName,
  researchInterests,
  responsibilities,
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
      <div>
        {!!teams.length && (
          <div css={dynamicContainerStyles}>
            <Headline3 styleAsHeading={5}>Team</Headline3>
            <Headline3 styleAsHeading={5}>Role</Headline3>

            {teams
              .flatMap(({ displayName, role, id }) => {
                const component = (
                  <div css={gridRowStyle} key={`comp-${id}`}>
                    <div css={teamContentStyle}>
                      <Link href={teamHref(id)}>Team {displayName}</Link>
                    </div>
                    <div css={teamContentStyle}>
                      <p css={textStyle}>{role}</p>
                    </div>
                  </div>
                );
                return [
                  <div css={gridDividerStyle}>
                    <Divider key={`sep-${id}`} />
                  </div>,
                  component,
                ];
              })
              .slice(1)}
          </div>
        )}
        {!!labsList.length && (
          <div css={detailsContentStyle}>
            <Headline3 styleAsHeading={5}>Labs</Headline3>
            <span>{labsList}</span>
          </div>
        )}
        {(researchInterests || isOwnProfile) && (
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
      </div>
    </Card>
  );
};

export default UserProfileRole;
