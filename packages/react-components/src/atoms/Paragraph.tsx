import { css } from '@emotion/react';
import * as colors from '../colors';
import { perRem } from '../pixels';
import { AccentColorName, layoutStyles } from '../text';

const secondaryStyles = css({
  fontSize: `${17 / perRem}em`,
  lineHeight: `${24 / 17}em`,
});
const primaryStyles = css({
  fontSize: `${18 / perRem}em`,
  lineHeight: `${24 / 18}em`,
});

type ParagraphProps = {
  readonly children: React.ReactNode;
  readonly primary?: boolean;
  readonly accent?: AccentColorName;
  readonly hasMargin?: boolean;
};

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  primary = false,
  accent,
  hasMargin = true,
}) => (
  <p
    css={[
      layoutStyles,
      primary ? primaryStyles : secondaryStyles,
      accent ? { color: colors[accent].rgb } : null,
      !hasMargin ? { margin: 0 } : null,
    ]}
  >
    {children}
  </p>
);

export default Paragraph;
