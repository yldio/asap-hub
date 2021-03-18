import React from 'react';
import css, { CSSObject } from '@emotion/css';

import * as colors from '../colors';
import { perRem } from '../pixels';
import { themes } from '../theme';
import { paddingStyles, borderRadius } from '../card';

const containerStyles = css({
  boxSizing: 'border-box',
  maxWidth: '100%',

  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: `${borderRadius / perRem}em`,
});

export type AccentVariant = 'default' | 'red' | 'green' | 'placeholder';

export const accents: Record<AccentVariant, CSSObject> = {
  default: {
    ...themes.light,
    borderColor: colors.steel.rgb,
    boxShadow: `0px 2px 4px ${colors.steel.rgb}`,
  },
  red: {
    backgroundColor: colors.rose.rgb,
    color: colors.ember.rgb,
    borderColor: colors.ember.rgb,
  },
  green: {
    backgroundColor: colors.mint.rgb,
    color: colors.pine.rgb,
    borderColor: colors.pine.rgb,
  },
  placeholder: {
    ...themes.light,
    border: `2px dotted ${colors.tin.rgb}`,
    borderRadius: 0,
  },
};

interface CardProps {
  readonly accent?: AccentVariant;
  readonly padding?: boolean;

  readonly children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({
  children,
  accent = 'default',
  padding = true,
}) => (
  <section
    css={[
      themes.light,
      containerStyles,
      padding && paddingStyles,
      accents[accent],
    ]}
  >
    {children}
  </section>
);

export default Card;
