import { OnboardingPageHeader } from '@asap-hub/gp2-components';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const OnboardingPage: React.FC = ({ children }) => {
  const location = useLocation();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const routerList = [
      '/core-details',
      '/background',
      '/groups',
      '/additional-details',
      '/preview',
    ];
    const { pathname } = location;
    const currentIndex = routerList.findIndex((x) => pathname.includes(x));
    setIndex(currentIndex);
  }, [location]);
  return (
    <article>
      <OnboardingPageHeader currentIndex={index} />
      <main>{children}</main>
    </article>
  );
};
export default OnboardingPage;
