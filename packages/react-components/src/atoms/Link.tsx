import { ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';

import { getButtonChildren, getButtonStyles } from '../button';
import { fern, paper, pine } from '../colors';
import { defaultThemeVariant, ThemeVariant } from '../theme';
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

const iconThemeStyles: Record<ThemeVariant, SerializedStyles> = {
  light: css({
    svg: {
      stroke: fern.rgb,
    },
    ':hover': {
      svg: {
        stroke: pine.rgb,
      },
    },
    ':active': { svg: { stroke: fern.rgb } },
  }),
  grey: css({
    svg: { stroke: fern.rgb },
    ':active': { svg: { stroke: pine.rgb } },
  }),
  dark: css({
    svg: { stroke: paper.rgb },
    ':active': { svg: { stroke: paper.rgb } },
  }),
};

const elipsedTextStyle = css({
  display: 'block',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

interface NormalLinkProps {
  readonly theme?: ThemeVariant;
  readonly buttonStyle?: undefined;
  readonly primary?: undefined;
  readonly small?: undefined;
  readonly enabled?: undefined;
  readonly margin?: undefined;
  readonly stretch?: undefined;
}

interface ButtonStyleLinkProps {
  readonly theme?: undefined;
  readonly buttonStyle: true;
  readonly primary?: boolean;
  readonly small?: boolean;
  readonly enabled?: boolean;
  readonly margin?: boolean;
  readonly stretch?: boolean;
}

type LinkProps = {
  readonly children: ReactNode;
  readonly href: string | undefined;
  readonly label?: string;
  readonly applyIconTheme?: boolean;
  readonly stretch?: boolean;
  readonly elipsedText?: boolean;
} & (NormalLinkProps | ButtonStyleLinkProps);

const Link: React.FC<LinkProps> = ({
  children,
  href,
  label,
  theme = defaultThemeVariant,
  buttonStyle = false,
  primary = false,
  small = false,
  enabled = true,
  applyIconTheme = false,
  margin = true,
  stretch = true,
  elipsedText = false,
}) => {
  const linkChildren = buttonStyle ? getButtonChildren(children) : children;
  const linkStyles = buttonStyle
    ? [getButtonStyles({ primary, small, enabled, children, margin, stretch })]
    : [
        styles,
        themeStyles[theme],
        applyIconTheme && iconThemeStyles[theme],
        elipsedText && elipsedTextStyle,
      ];

  return (
    <Anchor
      href={href}
      title={elipsedText ? (linkChildren as string) : undefined}
      enabled={enabled}
      aria-label={label}
      css={linkStyles}
    >
      {linkChildren}
    </Anchor>
  );
};

export default Link;
