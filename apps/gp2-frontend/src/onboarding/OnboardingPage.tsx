import { OnboardingPageHeader } from '@asap-hub/gp2-components';

const OnboardingPage: React.FC = ({ children }) => (
  <article>
    <OnboardingPageHeader />
    <main>{children}</main>
  </article>
);
export default OnboardingPage;
