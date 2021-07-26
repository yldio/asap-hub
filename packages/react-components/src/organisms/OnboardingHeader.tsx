import { css } from '@emotion/react';

import { padlockIcon, tickIcon } from '../icons';
import { Button, Headline2, Paragraph } from '../atoms';
import { pearl, steel } from '../colors';

import { perRem, smallDesktopScreen } from '../pixels';

const headerStyles = css({
  backgroundColor: pearl.rgb,
  borderBottom: `1px solid ${steel.rgb}`,
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
  flexGrow: 1,
});

const iconStyles = css({
  marginRight: `${12 / perRem}em`,
  display: 'flex',
  alignSelf: 'center',
});

type OnboardingHeaderProps = {
  isOnboardable: boolean;
};

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  isOnboardable,
}) => (
  <header css={headerStyles}>
    <div css={containerStyles}>
      <div css={textStyles}>
        <Headline2 styleAsHeading={3}>
          Your profile is {isOnboardable ? 'complete' : 'incomplete'}
        </Headline2>
        <Paragraph accent={'lead'}>
          {isOnboardable
            ? 'Click to publish your profile and start exploring the Hub.'
            : 'Complete your profile to unlock access to the Hub. Any edits will be privately stored until you’re ready to publish.'}
        </Paragraph>
      </div>
      <div css={buttonStyles}>
        <div>
          <Button enabled={!!isOnboardable} primary>
            <span css={iconStyles}>
              {isOnboardable ? tickIcon : padlockIcon}
            </span>
            Explore the Hub
          </Button>
        </div>
      </div>
    </div>
  </header>
);
export default OnboardingHeader;
