import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { OnboardingBackground } from '@asap-hub/gp2-components';

export default {
  title: 'GP2 / Templates / Onboarding / Background',
  component: OnboardingBackground,
};

const item = {
  ...gp2Fixtures.createUserResponse(),

  editBiographyHref: '',
  editKeywordsHref: '',
};
export const Normal = () => <OnboardingBackground {...item} />;
