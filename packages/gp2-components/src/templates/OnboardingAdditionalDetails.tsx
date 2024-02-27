import { gp2 } from '@asap-hub/model';
import { Paragraph } from '@asap-hub/react-components';
import {
  UserContributingCohorts,
  UserFundingStreams,
  UserQuestions,
} from '../organisms';

type OnboardingAdditionalDetailsProps = Pick<
  gp2.UserResponse,
  'questions' | 'firstName' | 'fundingStreams' | 'contributingCohorts'
> & {
  editQuestionsHref: string;
  editFundingStreamsHref: string;
  editContributingCohortsHref: string;
};
const OnboardingAdditionalDetails: React.FC<
  OnboardingAdditionalDetailsProps
> = ({
  questions,
  fundingStreams,
  contributingCohorts,
  editQuestionsHref,
  editFundingStreamsHref,
  editContributingCohortsHref,
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
  </>
);

export default OnboardingAdditionalDetails;
