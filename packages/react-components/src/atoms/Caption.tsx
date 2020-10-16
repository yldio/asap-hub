import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import { layoutStyles, AccentColorName, captionStyles } from '../text';

const figStyles = css({
  lineHeight: `${18 / 13.6}em`,
});

interface CaptionProps {
  readonly children: React.ReactNode;
  readonly accent?: AccentColorName;
  readonly asParagraph?: boolean;
}
const Caption: React.FC<CaptionProps> = ({
  children,
  accent,
  asParagraph = false,
}) => {
  const styles = [
    layoutStyles,
    captionStyles,
    accent ? { color: colors[accent].rgb } : null,
  ];

  return asParagraph ? (
    <p css={styles}>{children}</p>
  ) : (
    <figcaption css={[...styles, figStyles]}>{children}</figcaption>
  );
};

export default Caption;
