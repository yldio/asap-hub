import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { leftArrowIcon, rightArrowIcon } from '../icons';
import { mobileQuery, nonMobileQuery } from '../layout';
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
  steps,
}) => (
  <div
    css={css({
      marginTop: `${vminLinearCalcClamped(
        mobileScreen,
        -33,
        tabletScreen,
        -48,
        'px',
      )}`,
    })}
  >
    <PageBanner title={'Registration'} noMarginBottom noBorderTop>
      <div css={divStyle}>
        <div css={buttonStyle}>{leftArrowIcon}</div>
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
          {steps.map(({ disabled, href, name }) => (
            <OnboardedTabLink key={name} disabled={disabled} href={href}>
              {name}
            </OnboardedTabLink>
          ))}
        </nav>
        <div css={buttonStyle}>{rightArrowIcon}</div>
      </div>
    </PageBanner>
  </div>
);
export default OnboardingPageHeader;
