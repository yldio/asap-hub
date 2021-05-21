import { css } from '@emotion/react';

import * as colors from '../colors';
import { layoutStyles, AccentColorName, captionStyles } from '../text';

const figStyles = css({
  lineHeight: `${18 / 13.6}em`,
});

const boldStyles = css({
  fontWeight: 'bold',
});

interface CaptionProps {
  readonly children: React.ReactNode;
  readonly accent?: AccentColorName;
  readonly asParagraph?: boolean;
  readonly bold?: boolean;
}
const Caption: React.FC<CaptionProps> = ({
  children,
  accent,
  asParagraph = false,
  bold,
}) => {
  const styles = [
    layoutStyles,
    captionStyles,
    accent ? { color: colors[accent].rgb } : null,
    bold ? boldStyles : null,
  ];

  return asParagraph ? (
    <p css={styles}>{children}</p>
  ) : (
    <figcaption css={[...styles, figStyles]}>{children}</figcaption>
  );
};

export default Caption;
