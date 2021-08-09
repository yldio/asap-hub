import { useContext } from 'react';
import { css } from '@emotion/react';
import { UserResponse, UserTeam } from '@asap-hub/model';
import { network, sharedResearch } from '@asap-hub/routing';
import { UserProfileContext } from '@asap-hub/react-context';

import { Card, Headline2, Headline3, Link } from '../atoms';
import { mobileScreen, perRem } from '../pixels';
import UserProfilePlaceholderCard from './UserProfilePlaceholderCard';
import { getListStrWithSuffix, capitalizeText } from '../utils';

type UserProfileBackgroundProps = UserTeam &
  Pick<UserResponse, 'firstName' | 'labs'>;

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
  labs = [],
  firstName,
}) => {
  const teamHref = network({}).teams({}).team({ teamId: id }).$;
  const { isOwnProfile } = useContext(UserProfileContext);

  const labsList = getListStrWithSuffix(
    labs.map((lab) => lab.name),
    'Lab',
    capitalizeText,
  );

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
        {!!labsList.length && (
          <div css={detailsContentStyle}>
            <Headline3 styleAsHeading={5}>Labs</Headline3>
            {labsList}
          </div>
        )}
        {(approach || isOwnProfile) && (
          <div css={detailsContentStyle}>
            <Headline3 styleAsHeading={5}>Main Research Interests</Headline3>
            {approach ? (
              <p css={textStyle}>{approach}</p>
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
