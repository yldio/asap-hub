import { css, SerializedStyles } from '@emotion/react';
import * as colors from '../colors';
import { perRem } from '../pixels';
import { AccentColorName, layoutStyles } from '../text';

const primaryStyles = css({
  fontSize: `${17 / perRem}em`,
  lineHeight: `${24 / 17}em`,
});

type ParagraphProps = {
  readonly children: React.ReactNode;
  readonly primary?: boolean;
  readonly accent?: AccentColorName;
  readonly noMargin?: boolean;
  readonly styles?: SerializedStyles;
};

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  accent,
  noMargin = false,
  styles,
}) => (
  <p
    css={[
      noMargin ? { margin: 0 } : layoutStyles,
      primaryStyles,
      accent ? { color: colors[accent].rgb } : null,
      styles,
    ]}
  >
    {children}
  </p>
);

export default Paragraph;
