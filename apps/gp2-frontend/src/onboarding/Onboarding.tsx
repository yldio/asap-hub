import { OnboardingPageHeader } from '@asap-hub/gp2-components';

const Onboarding: React.FC = ({ children }) => (
  <div>
    <OnboardingPageHeader />
    {children}
  </div>
);
export default Onboarding;
