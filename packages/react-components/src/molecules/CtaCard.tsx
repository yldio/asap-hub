import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { Link, Card, Paragraph, CopyButton } from '../atoms';
import {
  mobileScreen,
  perRem,
  vminLinearCalcClamped,
  tabletScreen,
  smallDesktopScreen,
} from '../pixels';
import { activePrimaryBackgroundColorDefault, colors } from '..';

const getInTouchStyles = css({
  display: 'grid',
  gridTemplateColumns: 'auto',
  alignItems: 'center',
  padding: `${12 / perRem}em ${vminLinearCalcClamped(
    mobileScreen,
    24,
    tabletScreen,
    36,
    'px',
  )}`,
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    gridTemplateColumns: 'auto max-content',
  },
  [`@media (min-width: ${tabletScreen.min}px) and (max-width: ${smallDesktopScreen.min}px)`]:
    {
      paddingBottom: `${14 / perRem}em`,
    },
});

const buttonStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gap: `${8 / perRem}em`,
});

const copyButtonStyles = css({
  backgroundColor: 'inherit',
  borderColor: activePrimaryBackgroundColorDefault.rgba,
  ':hover, :focus': {
    borderColor: colors.info500.rgb,
  },
  path: {
    fill: colors.fern.rgb,
  },
});

type CtaCardProps = {
  href: string;
  buttonText: string;
  children: ReactNode;
  displayCopy?: boolean;
};

const CtaCard: React.FC<CtaCardProps> = ({
  href,
  buttonText,
  children,
  displayCopy,
}) => (
  <Card padding={false} accent="green">
    <div css={getInTouchStyles}>
      <Paragraph>{children}</Paragraph>
      <div css={buttonStyles}>
        <div css={{ display: 'flex', flexGrow: 1 }}>
          <Link buttonStyle small primary href={href} noMargin>
            {buttonText}
          </Link>
        </div>
        {displayCopy && (
          <CopyButton
            hoverTooltipText="Copy Email"
            clickTooltipText="Email Copied"
            onClick={() =>
              navigator.clipboard.writeText(href.split(':')[1] || '')
            }
            overrideStyles={copyButtonStyles}
          />
        )}
      </div>
    </div>
  </Card>
);

export default CtaCard;
