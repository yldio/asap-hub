import { css } from '@emotion/react';

import { CopyButton, Link } from '../atoms';
import { perRem, smallDesktopScreen, tabletScreen } from '../pixels';
import { activePrimaryBackgroundColorDefault } from '../button';
import { colors } from '..';

const contactStyles = css({
  display: 'flex',
  gap: `${8 / perRem}em`,
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    alignSelf: 'center',
  },
});

const buttonStyles = css({
  display: 'flex',
  flexGrow: 1,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexGrow: 'unset',
  },
});

const copyButtonStyles = css({
  backgroundColor: 'inherit',
  borderColor: activePrimaryBackgroundColorDefault.rgba,
  ':hover, :focus': {
    borderColor: colors.fern.rgb,
  },
  path: {
    fill: colors.fern.rgb,
  },
});
interface CtaContactSectionProps {
  readonly href: string;
  readonly buttonText: string;
  readonly displayCopy?: boolean;
}
const CtaContactSection: React.FC<CtaContactSectionProps> = ({
  href,
  buttonText,
  displayCopy = false,
}) => (
  <div css={contactStyles}>
    <div css={buttonStyles}>
      <Link buttonStyle small primary href={href} noMargin>
        {buttonText}
      </Link>
    </div>
    {displayCopy && (
      <CopyButton
        hoverTooltipText="Copy Email"
        clickTooltipText="Email Copied"
        onClick={() => navigator.clipboard.writeText(href.split(':')[1] || '')}
        overrideStyles={copyButtonStyles}
      />
    )}
  </div>
);

export default CtaContactSection;
