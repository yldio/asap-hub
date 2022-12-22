import { gp2 as gp2Routing } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { leftArrow, rightArrow } from '../icons';
import { mobileQuery, nonMobileQuery } from '../layout';
import OnboardedTabLink from '../molecules/OnboardedTabLink';
import PageBanner from './PageBanner';

type OnboardingPageHeaderProps = {
  currentPath: string;
};

const divStyle = css({
  display: 'flex',
  alignItems: 'flex-end',
  [mobileQuery]: {
    marginBottom: 0,
  },
});

const buttonStyle = css({
  [nonMobileQuery]: {
    display: 'none',
  },
});

const OnboardingPageHeader: React.FC<OnboardingPageHeaderProps> = ({
  currentPath,
}) => {
  const currentIndex = 0;
  return (
    <PageBanner title={'Registration'} noMarginBottom>
      <div css={divStyle}>
        <div css={buttonStyle}>{leftArrow}</div>
        <nav
          css={css({
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            [mobileQuery]: {
              justifyContent: 'center',
            },
          })}
        >
          <OnboardedTabLink href={gp2Routing.onboarding({}).coreDetails({}).$}>
            Core Details
          </OnboardedTabLink>
          <OnboardedTabLink
            disabled={currentIndex < 1}
            href={gp2Routing.onboarding({}).background({}).$}
          >
            Background
          </OnboardedTabLink>
          <OnboardedTabLink
            disabled={currentIndex < 2}
            href={gp2Routing.onboarding({}).groups({}).$}
          >
            GP2 Groups
          </OnboardedTabLink>
          <OnboardedTabLink
            disabled={currentIndex < 3}
            href={gp2Routing.onboarding({}).additionalDetails({}).$}
          >
            Additional Details
          </OnboardedTabLink>
          <OnboardedTabLink
            disabled={currentIndex < 4}
            href={gp2Routing.onboarding({}).preview({}).$}
          >
            Preview
          </OnboardedTabLink>
        </nav>
        <div css={buttonStyle}>{rightArrow}</div>
      </div>
    </PageBanner>
  );
};
export default OnboardingPageHeader;
