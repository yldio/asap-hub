import { css } from '@emotion/react';
import { isUserOnboardable } from '@asap-hub/validation';

import { padlockIcon, successIcon } from '../icons';
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
  onboardable: ReturnType<typeof isUserOnboardable>;
};

const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  onboardModalHref,
  onboardable: { isOnboardable },
}) => (
  <footer css={[headerStyles, irisCeruleanGradientStyles]}>
    <div css={containerStyles}>
      <div css={textStyles}>
        <Headline2 styleAsHeading={3}>
          Your profile is {isOnboardable ? 'complete' : 'incomplete'}
        </Headline2>
        <Paragraph>
          {isOnboardable
            ? 'Click to publish your profile and start exploring the Hub.'
            : 'Complete your profile to unlock access to the Hub. Any edits will be privately stored until you’re ready to publish.'}
        </Paragraph>
      </div>
      <div css={buttonStyles}>
        <div>
          <Link href={onboardModalHref} buttonStyle enabled={isOnboardable}>
            <span css={iconStyles}>
              {isOnboardable ? successIcon : padlockIcon}
            </span>
            Explore the Hub
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
export default OnboardingFooter;
