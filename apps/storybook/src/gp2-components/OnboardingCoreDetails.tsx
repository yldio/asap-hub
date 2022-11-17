import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { OnboardingCoreDetails } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Templates / Onboard Core Details',
  component: OnboardingCoreDetails,
};

const item = {
  ...gp2Fixtures.createUserResponse(),
};
export const Normal = () => <OnboardingCoreDetails {...item} />;
