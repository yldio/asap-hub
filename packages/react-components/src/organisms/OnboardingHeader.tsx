import { css } from '@emotion/react';

import { padlock } from '../icons';
import { Button, Headline2, Paragraph } from '../atoms';
import { pearl, steel } from '../colors';

import { perRem } from '../pixels';

const headerStyles = css({
  backgroundColor: pearl.rgb,
  borderBottom: `1px solid ${steel.rgb}`,
  padding: `${24 / perRem}em`,
  display: 'flex',
  button: {
    alignSelf: 'flex-end',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 0,
  },
});

const containerStyles = css({
  display: 'flex',
  width: '100%',
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
  isComplete: boolean;
}
const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  isComplete = false,
}) => {
  const title = isComplete
    ? 'Your profile is complete'
    : 'Your profile is incomplete';

  const subtitle = isComplete
    ? 'Click to publish your profile and start exploring the Hub.'
    : 'Once completed, you can publish your profile and start exploring the Hub.';

  return (
    <header css={headerStyles}>
      <div css={containerStyles}>
        <div css={textStyles}>
          <Headline2 styleAsHeading={1}>{title}</Headline2>
          <Paragraph accent={'lead'}>{subtitle}</Paragraph>
        </div>
        <Button onClick={() => {}} enabled={false}>
          <span css={iconStyles}>{padlock}</span>
          Explore the Hub
        </Button>
      </div>
    </header>
  );
};
export default OnboardingHeader;
