import { css } from '@emotion/react';

import { successIcon } from '../icons';
import { Link, Headline2, Paragraph } from '../atoms';
import { paper, steel } from '../colors';

import { perRem, tabletScreen } from '../pixels';
import { irisCeruleanGradientStyles } from '../appearance';

const footerStyles = css({
  borderTop: `1px solid ${steel.rgb}`,
  padding: `${6 / perRem}em ${24 / perRem}em`,
  display: 'flex',
});

const containerStyles = css({
  display: 'grid',
  width: '100%',
  columnGap: `${36 / perRem}em`,
  grid: `
    "title  " max-content
    "button " ${18 / perRem}em
    "button " max-content / 1fr `,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    grid: `
    "title    button" max-content
    "subtitle button" ${24 / perRem}em
    ".        button" max-content  / 1fr 270px`,
  },
});

const titleStyles = css({
  gridArea: 'title / title / span 2',
  color: paper.rgb,
});

const subtitleStyles = css({
  color: paper.rgb,
  display: 'none',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridArea: 'subtitle / subtitle / span 2',
    display: 'unset',
  },
});
const buttonStyles = css({
  gridArea: 'button',
  display: 'flex',
  maxHeight: `${90 / perRem}em`,
});

const iconStyles = css({
  marginRight: `${12 / perRem}em`,
  display: 'flex',
  alignSelf: 'center',
});

export type UserOnboardingResult = {
  incompleteSteps: Array<{ label: string; modalHref: string }>;
  totalSteps: number;
  isOnboardable: boolean;
};

type OnboardingFooterProps = {
  onboardModalHref?: string;
  onboardable?: UserOnboardingResult;
};

const OnboardingContent = ({
  title,
  subtitle,
  label,
  modalHref,
  isOnboardable,
}: {
  title: string;
  subtitle: string;
  label: string;
  modalHref: string;
  isOnboardable: boolean;
}) => (
  <footer css={[footerStyles, irisCeruleanGradientStyles]}>
    <div css={containerStyles}>
      <div css={titleStyles}>
        <Headline2 styleAsHeading={3}>{title}</Headline2>
      </div>
      <div css={subtitleStyles}>
        <Paragraph>{subtitle}</Paragraph>
      </div>
      <div css={buttonStyles}>
        <Link href={modalHref} buttonStyle>
          {isOnboardable && <span css={iconStyles}>{successIcon}</span>}
          {label}
        </Link>
      </div>
    </div>
  </footer>
);

const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  onboardModalHref,
  onboardable,
}) => {
  if (!onboardModalHref || !onboardable) return null;
  const { incompleteSteps, totalSteps, isOnboardable } = onboardable;
  if (incompleteSteps.length) {
    const props = {
      isOnboardable,
      modalHref: incompleteSteps[0].modalHref,
      label: `Next Step: ${incompleteSteps[0].label}`,
      title: `Your profile is ${Math.round(
        (1 - incompleteSteps.length / totalSteps) * 100,
      )}% complete`,
    };
    if (incompleteSteps.length === totalSteps) {
      return (
        <OnboardingContent
          {...props}
          title="Start completing your profile"
          subtitle={`Complete ${totalSteps} steps to unlock access to the Hub.`}
        />
      );
    }
    if (incompleteSteps.length === 1) {
      return (
        <OnboardingContent
          {...props}
          subtitle="Complete one last step to unlock access to the Hub."
        />
      );
    }
    return (
      <OnboardingContent
        {...props}
        subtitle="Complete your profile to unlock access to the Hub."
      />
    );
  }
  return (
    <OnboardingContent
      title="Your profile is complete"
      subtitle="Click to publish your profile and start exploring the Hub."
      isOnboardable={isOnboardable}
      modalHref={onboardModalHref}
      label="Publish my profile"
    />
  );
};

export default OnboardingFooter;
