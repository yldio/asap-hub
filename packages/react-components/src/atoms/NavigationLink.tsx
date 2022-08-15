import { css } from '@emotion/react';
import { NavHashLink } from 'react-router-hash-link';
import { activePrimaryStyles } from '../button';
import { lead } from '../colors';
import { navigationGrey } from '../layout';
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
  textDecoration: 'none',
  outline: 'none',
  stroke: lead.rgb,
  borderRadius: `${6 / perRem}em`,
  ':hover, :focus': {
    backgroundColor: navigationGrey.rgb,
  },
});

const textStyles = css({
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  fontSize: `${18 / perRem}em`,
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
        css={({ colors }) => [
          styles,
          squareBorder && squareBorderStyles,
          { [`&.${activeClassName}`]: activePrimaryStyles(colors) },
          !enabled && disableStyles,
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
      css={({ colors }) => [
        styles,
        squareBorder && squareBorderStyles,
        active && activePrimaryStyles(colors),
        !enabled && disableStyles,
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
