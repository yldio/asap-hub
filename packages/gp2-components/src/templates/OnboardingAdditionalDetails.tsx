import { gp2 } from '@asap-hub/model';
import { Paragraph } from '@asap-hub/react-components';
import {
  UserContributingCohorts,
  UserExternalProfiles,
  UserFundingStreams,
  UserQuestions,
} from '../organisms';

type OnboardingAdditionalDetailsProps = Pick<
  gp2.UserResponse,
  'questions' | 'fundingStreams' | 'contributingCohorts' | 'social'
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
      Adding additional details to your profile will inform other members about
      your specific interests and will aid in connecting you with other members
      regarding relevant workstreams. This step is completely optional.
    </Paragraph>
    <UserQuestions questions={questions} editHref={editQuestionsHref} />
    <UserFundingStreams
      fundingStreams={fundingStreams}
      editHref={editFundingStreamsHref}
    />
    <UserContributingCohorts
      contributingCohorts={contributingCohorts}
      editHref={editContributingCohortsHref}
    />
    <UserExternalProfiles social={social} editHref={editExternalProfilesHref} />
  </>
);

export default OnboardingAdditionalDetails;
