import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

import { OnboardingPageHeader, OnboardingPageFooter } from '../organisms';

const { vminLinearCalcClamped, mobileScreen, tabletScreen } = pixels;

type OnboardingPageProps = ComponentProps<typeof OnboardingPageHeader> &
  ComponentProps<typeof OnboardingPageFooter>;

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: vminLinearCalcClamped(mobileScreen, 24, tabletScreen, 32, 'px'),
  padding: `${vminLinearCalcClamped(
    mobileScreen,
    32,
    tabletScreen,
    48,
    'px',
  )} 0`,
});

const OnboardingPage: React.FC<OnboardingPageProps> = ({
  children,
  steps,
  ...footerProps
}) => (
  <article>
    <OnboardingPageHeader steps={steps} />
    <main css={containerStyles}>{children}</main>
    <OnboardingPageFooter {...footerProps} />
  </article>
);

export default OnboardingPage;
