import { NavHashLink } from 'react-router-hash-link';
import { css } from '@emotion/react';

import { useHasRouter } from '../routing';
import { lead } from '../colors';
import {
  perRem,
  lineHeight,
  mobileScreen,
  largeDesktopScreen,
  vminLinearCalc,
} from '../pixels';
import { navigationGrey } from '../layout';
import { activePrimaryStyles } from '../button';
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

interface NavigationLinkProps {
  readonly href: string;
  readonly enabled?: boolean;
  readonly icon?: JSX.Element;
}
const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  enabled = true,
  icon,
  children,
}) => {
  const [internal, url] = isInternalLink(href);

  if (useHasRouter() && internal) {
    return (
      <NavHashLink
        to={url}
        activeClassName={activeClassName}
        css={[
          styles,
          { [`&.${activeClassName}`]: activePrimaryStyles },
          !enabled && disableStyles,
        ]}
        smooth
        isActive={(match, _) => enabled && !!match}
      >
        <p css={textStyles}>
          <span css={iconStyles}>{icon}</span>
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
      css={[styles, active && activePrimaryStyles, !enabled && disableStyles]}
    >
      <p css={textStyles}>
        <span css={iconStyles}>{icon}</span>
        {children}
      </p>
    </a>
  );
};

export default NavigationLink;
