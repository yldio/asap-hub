import { css } from '@emotion/react';
import { UserOnboardingResult } from '@asap-hub/validation';

import { successIcon } from '../icons';
import { Link, Headline2, Paragraph } from '../atoms';
import { paper, steel } from '../colors';

import { perRem, tabletScreen } from '../pixels';
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
  [`@media (min-width: ${tabletScreen.min}px)`]: {
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

const buttonContainer = css({
  display: 'flex',
  width: '100%',
});

type OnboardingFooterProps = {
  onboardModalHref?: string;
  onboardable: UserOnboardingResult;
};

const OnboardingButton = ({
  onboardable,
  onboardModalHref,
}: OnboardingFooterProps) => {
  const buttonProps = onboardable.incompleteSteps.length
    ? {
        label: `Next Step: ${onboardable.incompleteSteps[0].label}`,
        modalHref: onboardable.incompleteSteps[0].modalHref,
      }
    : {
        label: 'Publish my profile',
        modalHref: onboardModalHref,
      };

  return (
    <Link href={buttonProps.modalHref} buttonStyle>
      <span css={iconStyles}>
        {!onboardable.incompleteSteps.length && successIcon}
      </span>
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
          {onboardable.incompleteSteps.length ? 'incomplete' : 'complete'}
        </Headline2>
        <Paragraph>
          {onboardable.incompleteSteps.length
            ? 'Complete your profile to unlock access to the Hub. Any edits will be privately stored until you’re ready to publish.'
            : 'Click to publish your profile and start exploring the Hub.'}
        </Paragraph>
      </div>
      <div css={buttonStyles}>
        <div css={buttonContainer}>
          {onboardable.incompleteSteps && (
            <OnboardingButton
              onboardable={onboardable}
              onboardModalHref={onboardModalHref}
            />
          )}
        </div>
      </div>
    </div>
  </footer>
);

export default OnboardingFooter;
