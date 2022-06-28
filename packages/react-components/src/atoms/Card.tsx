import { css, CSSObject } from '@emotion/react';

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
  overflow: 'hidden',
});

export type AccentVariant = 'default' | 'red' | 'green' | 'placeholder';

export const accents: Record<AccentVariant, CSSObject> = {
  default: {
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
    backgroundColor: 'transparent',
    color: colors.charcoal.rgb,
    border: `2px dotted ${colors.tin.rgb}`,
    borderRadius: 0,
  },
};

const strokeStyles = css({
  background: `linear-gradient(${colors.cerulean.rgb}, ${colors.cerulean.rgb}) no-repeat left/${borderRadius}px 100%`,
});

interface CardProps {
  readonly accent?: AccentVariant;
  readonly padding?: boolean;
  readonly stroke?: boolean;

  readonly children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({
  children,
  accent = 'default',
  padding = true,
  stroke = false,
}) => (
  <section
    css={[
      themes.light,
      containerStyles,
      stroke && strokeStyles,
      padding && paddingStyles,
      accents[accent],
    ]}
  >
    {children}
  </section>
);

export default Card;
