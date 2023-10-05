import { gp2 } from '@asap-hub/model';
import { crossQuery, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import {
  UserBiography,
  UserContactInformation,
  UserContributingCohorts,
  UserExternalProfiles,
  UserFundingStreams,
  UserTags,
  UserProjects,
  UserQuestions,
  UserWorkingGroups,
} from '../organisms';

type UserOverviewProps = Pick<
  gp2.UserResponse,
  | 'id'
  | 'email'
  | 'alternativeEmail'
  | 'biography'
  | 'tags'
  | 'fundingStreams'
  | 'projects'
  | 'workingGroups'
  | 'firstName'
  | 'contributingCohorts'
  | 'social'
> &
  ComponentProps<typeof UserQuestions> & {
    editBiographyHref?: string;
    editContactInfoHref?: string;
    editContributingCohortsHref?: string;
    editExternalProfilesHref?: string;
    editFundingStreamsHref?: string;
    editTagsHref?: string;
    editQuestionsHref?: string;
  };

const { rem } = pixels;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: `0 0 ${rem(48)}`,
});

const columnStyles = css({
  display: 'grid',
  gap: rem(32),
  [crossQuery]: {
    gridTemplateColumns: '1fr 1fr',
    rowGap: rem(32),
  },
});
const UserOverview: React.FC<UserOverviewProps> = ({
  id,
  biography,
  email,
  alternativeEmail,
  tags,
  fundingStreams,
  questions,
  projects,
  workingGroups,
  firstName,
  contributingCohorts,
  social,
  editBiographyHref,
  editContactInfoHref,
  editContributingCohortsHref,
  editExternalProfilesHref,
  editFundingStreamsHref,
  editTagsHref,
  editQuestionsHref,
}) => (
  <div css={containerStyles}>
    <div css={[columnStyles]}>
      <UserContactInformation
        alternativeEmail={alternativeEmail}
        email={email}
        editHref={editContactInfoHref}
      />
      <UserTags tags={tags} editHref={editTagsHref} />
    </div>
    <UserBiography biography={biography} editHref={editBiographyHref} />
    {projects.length > 0 && (
      <UserProjects projects={projects} firstName={firstName} id={id} />
    )}
    {workingGroups.length > 0 && (
      <UserWorkingGroups
        workingGroups={workingGroups}
        firstName={firstName}
        id={id}
      />
    )}
    {(editQuestionsHref || questions.length > 0) && (
      <UserQuestions
        questions={questions}
        firstName={firstName}
        editHref={editQuestionsHref}
      />
    )}
    {(editFundingStreamsHref || fundingStreams) && (
      <UserFundingStreams
        fundingStreams={fundingStreams}
        firstName={firstName}
        editHref={editFundingStreamsHref}
      />
    )}
    {(editContributingCohortsHref || contributingCohorts.length > 0) && (
      <UserContributingCohorts
        contributingCohorts={contributingCohorts}
        firstName={firstName}
        editHref={editContributingCohortsHref}
      />
    )}
    {(editExternalProfilesHref ||
      (social &&
        Object.values(social).filter((value) => !!value).length > 0)) && (
      <UserExternalProfiles
        social={social}
        editHref={editExternalProfilesHref}
      />
    )}
  </div>
);

export default UserOverview;
