import { OnboardingPageHeader } from '@asap-hub/gp2-components';

const Onboarding: React.FC = ({ children }) => (
  <article>
    <OnboardingPageHeader />
    <main>{children}</main>
  </article>
);
export default Onboarding;
