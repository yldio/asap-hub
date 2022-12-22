import { OnboardingPageHeader } from '@asap-hub/gp2-components';
import { useLocation } from 'react-router-dom';

const OnboardingPage: React.FC = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <article>
      <OnboardingPageHeader currentPath={pathname} />
      <main>{children}</main>
    </article>
  );
};
export default OnboardingPage;
