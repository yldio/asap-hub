import { css } from '@emotion/react';

import { successIcon } from '../icons';
import { Link, Headline2, Paragraph } from '../atoms';
import { paper, steel } from '../colors';

import { perRem, smallDesktopScreen } from '../pixels';
import { irisCeruleanGradientStyles } from '../appearance';

const headerStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: `${24 / perRem}em`,
  display: 'flex',
});

const containerStyles = css({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    flexDirection: 'row',
  },
});

const buttonStyles = css({
  display: 'flex',
  alignItems: 'flex-end',
  flexShrink: 0,
});

const textStyles = css({
  color: paper.rgb,
  flexGrow: 1,
});

const iconStyles = css({
  marginRight: `${12 / perRem}em`,
  display: 'flex',
  alignSelf: 'center',
});

type OnboardingFooterProps = {
  onboardModalHref?: string;
  onboardable: {
    steps: {
      label: string;
      id: string;
      modalHref?: string;
    }[];
    isOnboardable: boolean;
  };
};

const OnboardinButton = ({
  onboardable,
  onboardModalHref,
}: OnboardingFooterProps) => {
  const buttonProps = !onboardable.steps?.length
    ? {
        label: 'Explore the Hub',
        modalHref: onboardModalHref,
      }
    : {
        label: `Next Step: ${onboardable.steps[0].label}`,
        modalHref: onboardable.steps[0].modalHref,
      };

  return (
    <Link href={buttonProps.modalHref} buttonStyle>
      <span css={iconStyles}>{!onboardable.steps?.length && successIcon}</span>
      {buttonProps.label}
    </Link>
  );
};

const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  onboardModalHref,
  onboardable,
}) => (
  <footer css={[headerStyles, irisCeruleanGradientStyles]}>
    <div css={containerStyles}>
      <div css={textStyles}>
        <Headline2 styleAsHeading={3}>
          Your profile is{' '}
          {onboardable.isOnboardable ? 'complete' : 'incomplete'}
        </Headline2>
        <Paragraph>
          {onboardable.isOnboardable
            ? 'Click to publish your profile and start exploring the Hub.'
            : 'Complete your profile to unlock access to the Hub. Any edits will be privately stored until you’re ready to publish.'}
        </Paragraph>
      </div>
      <div css={buttonStyles}>
        <div>
          <OnboardinButton
            onboardable={onboardable}
            onboardModalHref={onboardModalHref}
          />
        </div>
      </div>
    </div>
  </footer>
);

export default OnboardingFooter;
