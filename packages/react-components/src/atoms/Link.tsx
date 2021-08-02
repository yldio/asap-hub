import { ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';

import { fern, paper, pine } from '../colors';
import { ThemeVariant, defaultThemeVariant } from '../theme';
import { getButtonStyles, getButtonChildren } from '../button';
import { Anchor } from '.';

const styles = css({
  textDecoration: 'underline',
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
    ':hover': { color: pine.rgb },
    ':active': { color: fern.rgb },
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

interface NormalLinkProps {
  readonly theme?: ThemeVariant;

  readonly buttonStyle?: undefined;

  readonly primary?: undefined;
  readonly small?: undefined;
  readonly enabled?: undefined;
}
interface ButtonStyleLinkProps {
  readonly theme?: undefined;

  readonly buttonStyle: true;

  readonly primary?: boolean;
  readonly small?: boolean;
  readonly enabled?: boolean;
}
type LinkProps = {
  readonly children: ReactNode;
  readonly href: string | undefined;
  readonly label?: string;
  readonly applyIconTheme?: boolean;
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
}) => {
  const linkStyles = buttonStyle
    ? [getButtonStyles({ primary, small, enabled, children })]
    : [styles, themeStyles[theme], applyIconTheme && iconThemeStyles[theme]];
  const linkChildren = buttonStyle ? getButtonChildren(children) : children;
  return (
    <Anchor href={href} enabled={enabled} aria-label={label} css={linkStyles}>
      {linkChildren}
    </Anchor>
  );
};

export default Link;
