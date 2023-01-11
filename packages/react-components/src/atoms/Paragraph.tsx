import { css } from '@emotion/react';
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
  readonly margin?: boolean;
};

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  accent,
  margin = true,
}) => (
  <p
    css={[
      margin ? layoutStyles : { margin: 0 },
      primaryStyles,
      accent ? { color: colors[accent].rgb } : null,
    ]}
  >
    {children}
  </p>
);

export default Paragraph;
