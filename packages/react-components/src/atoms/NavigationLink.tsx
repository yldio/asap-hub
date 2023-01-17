import { css } from '@emotion/react';
import { NavHashLink } from 'react-router-hash-link';
import { activePrimaryStyles } from '../button';
import { charcoal, lead, silver } from '../colors';
import {
  largeDesktopScreen,
  lineHeight,
  mobileScreen,
  perRem,
  vminLinearCalc,
} from '../pixels';
import { useHasRouter } from '../routing';
import { isInternalLink } from '../utils';

const activeClassName = 'active-link';

const styles = css({
  display: 'block',
  paddingLeft: `${12 / perRem}em`,
  paddingRight: `${12 / perRem}em`,
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
  borderRadius: `${6 / perRem}em`,
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
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,
  paddingRight: `${14 / perRem}em`,
});

const disableStyles = css({
  opacity: 0.3,
  pointerEvents: 'none',
});

const squareBorderStyles = css({
  borderRadius: 'unset',
});

interface NavigationLinkProps {
  readonly href: string;
  readonly enabled?: boolean;
  readonly icon?: JSX.Element;
  readonly squareBorder?: boolean;
}
const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  enabled = true,
  icon,
  squareBorder = false,
  children,
}) => {
  const [internal, url] = isInternalLink(href);

  if (useHasRouter() && internal) {
    return (
      <NavHashLink
        to={url}
        activeClassName={activeClassName}
        css={({ colors, navigationLinkTheme }) => [
          styles,
          squareBorder && squareBorderStyles,
          {
            [`&.${activeClassName}`]: activePrimaryStyles(colors),
          },
          !enabled && disableStyles,
          navigationLinkTheme,
        ]}
        smooth
        isActive={(match) => enabled && !!match && match.url === url}
      >
        <p css={textStyles}>
          {icon && <span css={iconStyles}>{icon}</span>}
          {children}
        </p>
      </NavHashLink>
    );
  }
  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;

  return (
    <a
      href={url}
      css={({ colors, navigationLinkTheme }) => [
        styles,
        squareBorder && squareBorderStyles,
        active && activePrimaryStyles(colors),
        !enabled && disableStyles,
        navigationLinkTheme,
      ]}
    >
      <p css={textStyles}>
        {icon && <span css={iconStyles}>{icon}</span>}
        {children}
      </p>
    </a>
  );
};

export default NavigationLink;
