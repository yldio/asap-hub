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

  button: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 0,
    alignSelf: 'flex-start',
  },

  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    flexDirection: 'row',

    button: {
      alignSelf: 'flex-end',
    },
  },
});

const textStyles = css({
  flexGrow: 1,
});

const iconStyles = css({
  marginRight: `${12 / perRem}em`,
  display: 'flex',
  alignItems: 'center',
});

interface OnboardingHeaderProps {
  onboardable: boolean;
}
const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onboardable = false,
}) => {
  const title = onboardable
    ? 'Your profile is complete'
    : 'Your profile is incomplete';

  const subtitle = onboardable
    ? 'Click to publish your profile and start exploring the Hub.'
    : 'Once completed, you can publish your profile and start exploring the Hub.';

  const icon = onboardable ? tickIcon : padlockIcon;

  return (
    <header css={headerStyles}>
      <div css={containerStyles}>
        <div css={textStyles}>
          <Headline2 styleAsHeading={3}>{title}</Headline2>
          <Paragraph accent={'lead'}>{subtitle}</Paragraph>
        </div>
        <Button onClick={() => {}} enabled={onboardable} primary>
          <span css={iconStyles}>{icon}</span>
          Explore the Hub
        </Button>
      </div>
    </header>
  );
};
export default OnboardingHeader;
