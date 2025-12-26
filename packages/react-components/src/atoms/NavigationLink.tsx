/** @jsxImportSource @emotion/react */
import { css, Theme } from '@emotion/react';
import { PropsWithChildren } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { activePrimaryStyles } from '../button';
import { charcoal, lead, silver } from '../colors';
import {
  largeDesktopScreen,
  lineHeight,
  mobileScreen,
  rem,
  vminLinearCalc,
} from '../pixels';
import { useHasRouter } from '../routing';
import { isInternalLink } from '../utils';

const styles = css({
  display: 'block',
  paddingLeft: rem(12),
  paddingRight: rem(12),
  paddingTop: vminLinearCalc(
    mobileScreen,
    12 + 1,
    largeDesktopScreen,
    15 + 1,
    'px',
  ),
  paddingBottom: vminLinearCalc(
    mobileScreen,
    12 - 1,
    largeDesktopScreen,
    15 - 1,
    'px',
  ),
  color: 'unset',
  stroke: lead.rgb,
  svg: {
    stroke: charcoal.rgb,
  },
  textDecoration: 'none',
  outline: 'none',
  borderRadius: rem(6),
  transition: 'background-color 100ms ease-in-out, color 100ms ease-in-out',
  ':hover, :focus': {
    backgroundColor: silver.rgb,
  },
});

const textStyles = css({
  margin: 0,
  display: 'flex',
  alignItems: 'center',
});
const iconStyles = css({
  display: 'inline-block',
  width: rem(lineHeight),
  height: rem(lineHeight),
  paddingRight: rem(14),
});

const disableStyles = css({
  opacity: 0.3,
  pointerEvents: 'none',
});

const squareBorderStyles = css({
  borderRadius: 'unset',
});

type NavigationLinkProps = NavigationProps & {
  readonly icon?: JSX.Element;
} & PropsWithChildren;
const NavigationLink: React.FC<NavigationLinkProps> = ({
  icon,
  children,
  ...props
}) => (
  <Navigation {...props}>
    <p css={textStyles}>
      {icon && <span css={iconStyles}>{icon}</span>}
      {children}
    </p>
  </Navigation>
);

interface NavigationProps {
  readonly href: string;
  readonly enabled?: boolean;
  readonly squareBorder?: boolean;
}
export const Navigation: React.FC<NavigationProps & PropsWithChildren> = ({
  href,
  children,
  enabled = true,
  squareBorder,
}) => {
  const [internal, url] = isInternalLink(href);
  const location = useLocation();

  if (useHasRouter() && internal) {
    // Use prefix matching to highlight parent sections when viewing subsections
    // e.g., /network should be highlighted when at /network/interest-groups
    const linkPath = url.split('#')[0];
    const isActive = linkPath
      ? location.pathname === linkPath ||
        location.pathname.startsWith(`${linkPath}/`)
      : false;

    return (
      <NavHashLink
        to={url}
        smooth
        style={{ textDecoration: 'none', color: 'unset' }}
        className={enabled && isActive ? 'active' : undefined}
      >
        <div
          css={({ colors, components }: Theme) => [
            styles,
            squareBorder && squareBorderStyles,
            enabled && isActive && activePrimaryStyles(colors),
            !enabled && disableStyles,
            components?.NavigationLink?.styles,
          ]}
        >
          {children}
        </div>
      </NavHashLink>
    );
  }
  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;

  return (
    <a
      href={url}
      className={active ? 'active' : undefined}
      css={({ colors, components }: Theme) => [
        styles,
        squareBorder && squareBorderStyles,
        active && activePrimaryStyles(colors),
        !enabled && disableStyles,
        components?.NavigationLink?.styles,
      ]}
    >
      {children}
    </a>
  );
};

export default NavigationLink;
