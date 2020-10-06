import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import { perRem } from '../pixels';
import { layoutStyles, AccentColorName } from '../text';

const secondaryStyles = css({
  fontSize: `${17 / perRem}em`,
  lineHeight: `${24 / 17}em`,
});
const primaryStyles = css({
  fontSize: `${18 / perRem}em`,
  lineHeight: `${24 / 18}em`,
});

const smallStyles = css({
  fontSize: `${14 / perRem}em`,
  lineHeight: `${24 / 12}em`,
});

type ParagraphProps = {
  readonly children: React.ReactNode;
  readonly primary?: boolean;
  readonly accent?: AccentColorName;
  readonly small?: boolean;
};

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  primary = false,
  accent,
  small = false,
}) => {
  return (
    <p
      css={[
        layoutStyles,
        primary ? primaryStyles : secondaryStyles,
        accent ? { color: colors[accent].rgb } : null,
        small ? smallStyles : null,
      ]}
    >
      {children}
    </p>
  );
};

export default Paragraph;
