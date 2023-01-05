import { OnboardingPageHeader } from '@asap-hub/gp2-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { useLocation } from 'react-router-dom';

const orderedSteps = [
  {
    href: gp2Routing.onboarding({}).coreDetails({}).$,
    name: 'Core Details',
  },
  {
    href: gp2Routing.onboarding({}).background({}).$,
    name: 'Background',
  },
  {
    href: gp2Routing.onboarding({}).groups({}).$,
    name: 'GP2 Groups',
  },
  {
    href: gp2Routing.onboarding({}).additionalDetails({}).$,
    name: 'Additional Details',
  },
  {
    href: gp2Routing.onboarding({}).preview({}).$,
    name: 'Preview',
  },
];

const OnboardingPage: React.FC = ({ children }) => {
  const { pathname } = useLocation();

  const steps = orderedSteps.map((step, index) => ({
    ...step,
    disabled: index > orderedSteps.findIndex(({ href }) => href === pathname),
    // validation is going to be done with the complete flag
    completed: false,
  }));

  return (
    <article>
      <OnboardingPageHeader steps={steps} />
      <main>{children}</main>
    </article>
  );
};
export default OnboardingPage;
