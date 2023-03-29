import React, { ReactNode } from 'react';
import { css, SerializedStyles, Theme } from '@emotion/react';

import { getButtonChildren, getButtonStyles } from '../button';
import { fern, paper, pine } from '../colors';
import { defaultThemeVariant, ThemeVariant } from '../theme';
import Ellipsis from './Ellipsis';
import { Anchor } from '.';

export const styles = css({
  textDecoration: 'underline solid transparent',
  transition: 'text-decoration 100ms ease-in-out, color 100ms ease-in-out',

  ':hover': {
    textDecoration: 'underline',
  },
  ':active': {
    textDecoration: 'none',
  },
});

export const themeStyles: Record<ThemeVariant, SerializedStyles> = {
  light: css({
    color: fern.rgb,
  }),
  grey: css({ color: fern.rgb, ':active': { color: pine.rgb } }),
  dark: css({ color: paper.rgb, ':active': { color: paper.rgb } }),
};

export const getLinkColors = (
  colors: Theme['colors'],
  themeVariant: ThemeVariant,
): SerializedStyles =>
  colors?.primary500
    ? css({ color: colors.primary500.rgba })
    : themeStyles[themeVariant];

const iconThemeStyles: (
  colors: Theme['colors'],
) => Record<ThemeVariant, SerializedStyles> = ({
  primary500 = fern,
  primary900 = pine,
}: Theme['colors'] = {}) => ({
  light: css({
    svg: {
      stroke: primary500.rgba,
    },
    ':hover': {
      svg: {
        stroke: primary900.rgba,
      },
    },
    ':active': { svg: { stroke: primary500.rgba } },
  }),
  grey: css({
    svg: { stroke: primary500.rgba },
    ':active': { svg: { stroke: primary900.rgba } },
  }),
  dark: css({
    svg: { stroke: paper.rgb },
    ':active': { svg: { stroke: paper.rgb } },
  }),
});

interface NormalLinkProps {
  readonly themeVariant?: ThemeVariant;
  readonly buttonStyle?: undefined;
  readonly primary?: undefined;
  readonly small?: undefined;
  readonly enabled?: undefined;
  readonly noMargin?: undefined;
  readonly fullWidth?: undefined;
}

interface ButtonStyleLinkProps {
  readonly themeVariant?: undefined;
  readonly buttonStyle: true;
  readonly primary?: boolean;
  readonly small?: boolean;
  readonly enabled?: boolean;
  readonly noMargin?: boolean;
  readonly fullWidth?: boolean;
}

type LinkProps = {
  readonly children: ReactNode;
  readonly href: string | undefined;
  readonly label?: string;
  readonly applyIconTheme?: boolean;
  readonly ellipsed?: boolean;
  readonly underlined?: boolean;
} & (NormalLinkProps | ButtonStyleLinkProps);

const Link: React.FC<LinkProps> = ({
  children,
  href,
  label,
  themeVariant = defaultThemeVariant,
  buttonStyle = false,
  primary = false,
  small = false,
  enabled = true,
  applyIconTheme = false,
  noMargin,
  fullWidth = false,
  ellipsed = false,
  underlined = false,
}) => {
  const linkStyles = ({ colors }: Theme) =>
    buttonStyle
      ? [
          getButtonStyles({
            primary,
            small,
            enabled,
            children,
            noMargin,
            fullWidth,
            colors,
          }),
        ]
      : [
          styles,
          getLinkColors(colors, themeVariant),
          applyIconTheme && iconThemeStyles(colors)[themeVariant],
          underlined && { textDecoration: 'underline' },
        ];
  const linkChildren = buttonStyle ? getButtonChildren(children) : children;
  const applyEllipsis = ellipsed && typeof linkChildren === 'string';
  return (
    <Anchor
      href={href}
      enabled={enabled}
      aria-label={label}
      css={(theme) => linkStyles(theme)}
      title={applyEllipsis ? linkChildren : undefined}
    >
      {applyEllipsis ? <Ellipsis>{linkChildren}</Ellipsis> : linkChildren}
    </Anchor>
  );
};

export default Link;
