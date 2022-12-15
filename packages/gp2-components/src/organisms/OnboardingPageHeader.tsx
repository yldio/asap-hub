import { TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageBanner from './PageBanner';

const OnboardingPageHeader: React.FC = () => {
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
    <PageBanner title={'Registration'} noMarginBottom>
      <TabNav>
        <TabLink
          visited={index >= 0}
          href={gp2Routing.onboarding({}).coreDetails({}).$}
        >
          Core Details
        </TabLink>
        <TabLink
          visited={1 - index <= 0}
          href={gp2Routing.onboarding({}).background({}).$}
        >
          Background
        </TabLink>
        <TabLink
          visited={2 - index <= 0}
          href={gp2Routing.onboarding({}).groups({}).$}
        >
          GP2 Groups
        </TabLink>
        <TabLink
          visited={3 - index <= 0}
          href={gp2Routing.onboarding({}).additionalDetails({}).$}
        >
          Additional Details
        </TabLink>
        <TabLink
          visited={4 - index <= 0}
          href={gp2Routing.onboarding({}).preview({}).$}
        >
          Preview
        </TabLink>
      </TabNav>
    </PageBanner>
  );
};

export default OnboardingPageHeader;
