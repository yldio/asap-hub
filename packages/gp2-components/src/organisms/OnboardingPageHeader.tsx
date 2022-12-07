import { Headline2, TabLink, TabNav } from '@asap-hub/react-components';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';
import colors from '../templates/colors';

const headerStyles = css({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderBottom: `1px solid ${colors.neutral500.rgb}`,
  marginBottom: '48px',
});

const OnboardingPageHeader: React.FC = () => (
  <header css={headerStyles}>
    <Headline2 noMargin>Registration</Headline2>
    <TabNav>
      <TabLink href={gp2Routing.onboarding({}).coreDetails({}).$}>
        Core Details
      </TabLink>
      <TabLink href={gp2Routing.onboarding({}).background({}).$}>
        Background
      </TabLink>
      <TabLink href={gp2Routing.onboarding({}).groups({}).$}>
        GP2 Groups
      </TabLink>
      <TabLink href={gp2Routing.onboarding({}).additionalDetails({}).$}>
        Additional Details
      </TabLink>
      <TabLink href={gp2Routing.onboarding({}).preview({}).$}>Preview</TabLink>
    </TabNav>
  </header>
);

export default OnboardingPageHeader;
