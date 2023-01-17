import { gp2 } from '@asap-hub/model';
import { Paragraph } from '@asap-hub/react-components';
import { UserContributingCohorts } from '../organisms';
import UserExternalProfiles from '../organisms/UserExternalProfiles';
import UserFundingStreams from '../organisms/UserFundingStreams';
import UserQuestions from '../organisms/UserQuestions';

type OnboardingAdditionalDetailsProps = Pick<
  gp2.UserResponse,
  | 'questions'
  | 'firstName'
  | 'fundingStreams'
  | 'contributingCohorts'
  | 'social'
> & {
  editQuestionsHref: string;
  editFundingStreamsHref: string;
  editContributingCohortsHref: string;
  editExternalProfilesHref: string;
};
const OnboardingAdditionalDetails: React.FC<
  OnboardingAdditionalDetailsProps
> = ({
  questions,
  firstName,
  fundingStreams,
  contributingCohorts,
  social,
  editQuestionsHref,
  editFundingStreamsHref,
  editContributingCohortsHref,
  editExternalProfilesHref,
}) => (
  <>
    <Paragraph noMargin>
      Next up, we’d like to capture some more information around your skills and
      experiences in order to help others to understand your areas of focus.
    </Paragraph>
    <UserQuestions
      firstName={firstName}
      questions={questions}
      editHref={editQuestionsHref}
    />
    <UserFundingStreams
      fundingStreams={fundingStreams}
      editHref={editFundingStreamsHref}
    />
    <UserContributingCohorts
      contributingCohorts={contributingCohorts}
      firstName={firstName}
      editHref={editContributingCohortsHref}
    />
    <UserExternalProfiles social={social} editHref={editExternalProfilesHref} />
  </>
);

export default OnboardingAdditionalDetails;
