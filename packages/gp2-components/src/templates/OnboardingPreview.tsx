import { crossQuery, Paragraph, pixels } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import { ContactSupport } from '../molecules';
import {
  UserBiography,
  UserContactInformation,
  UserContributingCohorts,
  UserDetailHeaderCard,
  UserExternalProfiles,
  UserFundingStreams,
  UserKeywords,
  UserProjects,
  UserQuestions,
  UserWorkingGroups,
} from '../organisms';
import OnboardingAdditionalDetails from './OnboardingAdditionalDetails';
import OnboardingBackground from './OnboardingBackground';
import OnboardingCoreDetails from './OnboardingCoreDetails';
import OnboardingGroups from './OnboardingGroups';

const { onboarding } = gp2Routing;
const { rem } = pixels;

const columnStyles = css({
  display: 'grid',
  gap: rem(32),
  [crossQuery]: {
    gridTemplateColumns: '1fr 1fr',
    rowGap: rem(32),
  },
});

type OnboardingPreviewProps = ComponentProps<typeof OnboardingCoreDetails> &
  ComponentProps<typeof OnboardingBackground> &
  ComponentProps<typeof OnboardingGroups> &
  ComponentProps<typeof OnboardingAdditionalDetails> & {
    editKeyInfoHref: string;
    editContactInfoHref: string;
  };

const OnboardingPreview: React.FC<OnboardingPreviewProps> = ({
  biography,
  keywords,
  email,
  alternativeEmail,
  projects,
  workingGroups,
  questions,
  fundingStreams,
  contributingCohorts,
  social,
  editBiographyHref,
  editContactInfoHref,
  editKeyInfoHref,
  editKeywordsHref,
  editQuestionsHref,
  editFundingStreamsHref,
  editContributingCohortsHref,
  editExternalProfilesHref,
  ...headerProps
}) => (
  <>
    <Paragraph noMargin>
      It’s time to preview what your profile will look like to others on the
      network once published. Once you’re happy with what others will see, click
      “Publish” to begin exploring.
    </Paragraph>
    <UserDetailHeaderCard
      {...headerProps}
      editHref={onboarding({}).preview({}).editKeyInfo({}).$}
    />
    <div css={[columnStyles]}>
      <UserContactInformation
        editHref={editContactInfoHref}
        alternativeEmail={alternativeEmail}
        email={email}
      />
      <UserKeywords keywords={keywords} editHref={editKeywordsHref} />
    </div>
    <UserBiography biography={biography} editHref={editBiographyHref} />
    {projects && (
      <UserProjects
        id={headerProps.id}
        firstName={headerProps.firstName}
        noLinks
        projects={projects}
        subtitle={<ContactSupport />}
      />
    )}
    {workingGroups && (
      <UserWorkingGroups
        id={headerProps.id}
        firstName={headerProps.firstName}
        noLinks
        workingGroups={workingGroups}
        subtitle={<ContactSupport />}
      />
    )}
    <UserQuestions
      firstName={headerProps.firstName}
      questions={questions}
      editHref={editQuestionsHref}
    />
    <UserFundingStreams
      fundingStreams={fundingStreams}
      firstName={headerProps.firstName}
      editHref={editFundingStreamsHref}
    />
    <UserContributingCohorts
      contributingCohorts={contributingCohorts}
      firstName={headerProps.firstName}
      editHref={editContributingCohortsHref}
    />
    <UserExternalProfiles social={social} editHref={editExternalProfilesHref} />
  </>
);

export default OnboardingPreview;
