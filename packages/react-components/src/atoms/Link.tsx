import { ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';

import { fern, paper, pine } from '../colors';
import { ThemeVariant, defaultThemeVariant } from '../theme';
import { getButtonStyles, getButtonChildren } from '../button';
import { Anchor } from '.';

const styles = css({
  textDecoration: 'underline',
});
export const themeStyles: Record<ThemeVariant, SerializedStyles> = {
  light: css({ color: fern.rgb, ':active': { color: pine.rgb } }),
  grey: css({ color: fern.rgb, ':active': { color: pine.rgb } }),
  dark: css({ color: paper.rgb, ':active': { color: paper.rgb } }),
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
}) => {
  const linkStyles = buttonStyle
    ? [getButtonStyles({ primary, small, enabled, children })]
    : [styles, themeStyles[theme]];
  const linkChildren = buttonStyle ? getButtonChildren(children) : children;
  return (
    <Anchor href={href} enabled={enabled} aria-label={label} css={linkStyles}>
      {linkChildren}
    </Anchor>
  );
};

export default Link;
