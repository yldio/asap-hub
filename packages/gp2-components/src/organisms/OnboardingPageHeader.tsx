import { css } from '@emotion/react';
import { rightArrow } from '../icons';
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
  <PageBanner title={'Registration'} noMarginBottom>
    <div css={divStyle}>
      <div css={[buttonStyle, { transform: 'rotate(180deg)' }]}>
        {rightArrow}
      </div>
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
      <div css={buttonStyle}>{rightArrow}</div>
    </div>
  </PageBanner>
);
export default OnboardingPageHeader;
