import { TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import PageBanner from './PageBanner';

type OnboardingPageHeaderProps = {
  currentIndex: number;
};

const OnboardingPageHeader: React.FC<OnboardingPageHeaderProps> = ({
  currentIndex,
}) => (
  <PageBanner title={'Registration'} noMarginBottom>
    <TabNav>
      <TabLink
        visited={currentIndex >= 0}
        href={gp2Routing.onboarding({}).coreDetails({}).$}
      >
        Core Details
      </TabLink>
      <TabLink
        visited={currentIndex >= 1}
        href={gp2Routing.onboarding({}).background({}).$}
      >
        Background
      </TabLink>
      <TabLink
        visited={currentIndex >= 2}
        href={gp2Routing.onboarding({}).groups({}).$}
      >
        GP2 Groups
      </TabLink>
      <TabLink
        visited={currentIndex >= 3}
        href={gp2Routing.onboarding({}).additionalDetails({}).$}
      >
        Additional Details
      </TabLink>
      <TabLink
        visited={currentIndex >= 4}
        href={gp2Routing.onboarding({}).preview({}).$}
      >
        Preview
      </TabLink>
    </TabNav>
  </PageBanner>
);
export default OnboardingPageHeader;
