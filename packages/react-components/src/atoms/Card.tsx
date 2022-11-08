import { css, CSSObject, SerializedStyles } from '@emotion/react';
import { borderRadius, paddingStyles } from '../card';
import * as colors from '../colors';
import { perRem } from '../pixels';
import { themes } from '../theme';

const containerStyles = css({
  boxSizing: 'border-box',
  maxWidth: '100%',
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: `${borderRadius / perRem}em`,
});

export type AccentVariant =
  | 'default'
  | 'red'
  | 'green'
  | 'placeholder'
  | 'neutral200';

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
  neutral200: {
    backgroundColor: colors.neutral200.rgb,
    borderColor: colors.steel.rgb,
    boxShadow: `0px 2px 4px ${colors.steel.rgb}`,
  },
};

const strokeStyles = (color: string, strokeSize: number) =>
  css({
    background: `linear-gradient(${color}, ${color}) no-repeat left/${strokeSize}px 100%`,
  });

interface CardProps {
  readonly accent?: AccentVariant;
  readonly padding?: boolean;
  readonly stroke?: boolean;
  readonly noShadow?: boolean;
  readonly strokeColor?: string;
  readonly strokeSize?: number;
  readonly overrideStyles?: SerializedStyles;

  readonly children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({
  children,
  accent = 'default',
  padding = true,
  stroke = false,
  noShadow = false,
  strokeColor = colors.cerulean.rgb,
  strokeSize = borderRadius,
  overrideStyles,
}) => (
  <section
    css={[
      themes.light,
      containerStyles,
      stroke && strokeStyles(strokeColor, strokeSize),
      padding && paddingStyles,
      accents[accent],
      noShadow && { boxShadow: 'none' },
      overrideStyles,
    ]}
  >
    {children}
  </section>
);

export default Card;
