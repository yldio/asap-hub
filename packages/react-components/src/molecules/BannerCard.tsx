import { ReactElement, ReactNode } from 'react';
import { css, CSSObject } from '@emotion/react';

import {
  ceruleanFernGradientStyles,
  magentaCeruleanGradientStyles,
} from '../appearance';
import { perRem } from '../pixels';
import { paper } from '../colors';
import { paddingStyles, borderRadius } from '../card';
import { Card } from '../atoms';
import { validTickIcon, warningTransparentIcon } from '../icons';

const gradientStyles: Record<BannerCardProps['type'], CSSObject> = {
  success: ceruleanFernGradientStyles,
  warning: magentaCeruleanGradientStyles,
};
const bannerStyles = css({
  borderTopLeftRadius: borderRadius,
  borderTopRightRadius: borderRadius,
  height: `${36 / perRem}em`,
  padding: `${24 / perRem}em 0`,

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  svg: { stroke: paper.rgb, fill: paper.rgb },
});

const contentStyles = css({
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${24 / perRem}em`,

  textAlign: 'center',
});

const icons: Record<BannerCardProps['type'], ReactElement> = {
  success: validTickIcon,
  warning: warningTransparentIcon,
};

interface BannerCardProps {
  readonly children: ReactNode;
  readonly type: 'success' | 'warning';
}
const BannerCard: React.FC<BannerCardProps> = ({ type, children }) => (
  <Card padding={false}>
    <div role="presentation" css={[gradientStyles[type], bannerStyles]}>
      {icons[type]}
    </div>
    <div css={[paddingStyles, contentStyles]}>{children}</div>
  </Card>
);

export default BannerCard;
