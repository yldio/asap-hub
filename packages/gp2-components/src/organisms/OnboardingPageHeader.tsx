import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { mobileQuery } from '../layout';
import OnboardedTabLink from '../molecules/OnboardedTabLink';
import PageBanner from './PageBanner';

type OnboardingStep = {
  href: string;
  name: string;
  disabled: boolean;
  completed: boolean;
};

type OnboardingPageHeaderProps = {
  steps: OnboardingStep[];
};

const { vminLinearCalcClamped, mobileScreen, tabletScreen } = pixels;

const containerStyles = css({
  marginTop: `${vminLinearCalcClamped(
    mobileScreen,
    -33,
    tabletScreen,
    -48,
    'px',
  )}`,
});

const navStyles = css({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',

  [mobileQuery]: {
    justifyContent: 'center',
    marginBottom: 0,
  },
});

const OnboardingPageHeader: React.FC<OnboardingPageHeaderProps> = ({
  steps,
}) => (
  <div css={containerStyles}>
    <PageBanner title={'Registration'} noMarginBottom noBorderTop>
      <nav css={navStyles}>
        {steps.map(({ disabled, href, name, completed }, index) => (
          <OnboardedTabLink
            key={name}
            disabled={disabled}
            href={href}
            index={index + 1}
            completed={completed}
          >
            {name}
          </OnboardedTabLink>
        ))}
      </nav>
    </PageBanner>
  </div>
);
export default OnboardingPageHeader;
