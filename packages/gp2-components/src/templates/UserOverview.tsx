import { gp2 } from '@asap-hub/model';
import {
  Card,
  crossQuery,
  Headline3,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import {
  UserBiography,
  UserContactInformation,
  UserContributingCohorts,
  UserExternalProfiles,
  UserFundingStreams,
  UserKeywords,
  UserQuestions,
  UserProjects,
  UserWorkingGroups,
} from '../organisms';

type UserOverviewProps = Pick<
  gp2.UserResponse,
  | 'id'
  | 'email'
  | 'secondaryEmail'
  | 'biography'
  | 'keywords'
  | 'fundingStreams'
  | 'projects'
  | 'workingGroups'
  | 'firstName'
  | 'contributingCohorts'
  | 'social'
> &
  ComponentProps<typeof UserQuestions>;

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: `${rem(32)} 0 ${rem(48)}`,
});

const columnStyles = css({
  display: 'grid',
  gap: rem(32),
  [crossQuery]: {
    gridTemplateColumns: '1fr 1fr',
    rowGap: rem(32),
  },
});
const cardStyles = css({ padding: `${rem(32)} ${rem(24)}` });
const UserOverview: React.FC<UserOverviewProps> = ({
  id,
  biography,
  email,
  secondaryEmail,
  keywords,
  fundingStreams,
  questions,
  projects,
  workingGroups,
  firstName,
  contributingCohorts,
  social,
}) => (
  <div css={containerStyles}>
    <div css={[columnStyles]}>
      <UserContactInformation secondaryEmail={secondaryEmail} email={email} />
      <UserKeywords keywords={keywords} />
    </div>
    <UserBiography biography={biography} />
    {projects.length > 0 && (
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Projects</Headline3>
          <UserProjects projects={projects} firstName={firstName} id={id} />
        </div>
      </Card>
    )}
    {workingGroups.length > 0 && (
      <Card padding={false}>
        <div css={cardStyles}>
          <Headline3 noMargin>Working Groups</Headline3>
          <UserWorkingGroups
            workingGroups={workingGroups}
            firstName={firstName}
            id={id}
          />
        </div>
      </Card>
    )}
    {questions.length > 0 && (
      <UserQuestions questions={questions} firstName={firstName} />
    )}
    {fundingStreams && <UserFundingStreams fundingStreams={fundingStreams} />}
    {contributingCohorts.length > 0 && (
      <UserContributingCohorts
        contributingCohorts={contributingCohorts}
        firstName={firstName}
      />
    )}
    {social && Object.values(social).filter((value) => !!value) && (
      <UserExternalProfiles social={social} />
    )}
  </div>
);

export default UserOverview;
