import React from 'react';
import { NavHashLink } from 'react-router-hash-link';
import css from '@emotion/css';

import {
  discover,
  network,
  sharedResearch,
  news,
  events,
} from '@asap-hub/routing';

import { TextChildren } from '../text';
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

interface NavigationLinkProps {
  readonly href: string;

  readonly icon: JSX.Element;
  readonly children: TextChildren;
}
const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  icon,
  children,
}) => {
  if (useHasRouter() && isInternalLink(href)) {
    return (
      <NavHashLink
        to={href}
        activeClassName={activeClassName}
        css={[styles, { [`&.${activeClassName}`]: activePrimaryStyles }]}
        smooth
        isActive={(match, _) => !!match}
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
    <a href={href} css={[styles, active && activePrimaryStyles]}>
      <p css={textStyles}>
        <span css={iconStyles}>{icon}</span>
        {children}
      </p>
    </a>
  );
};

export default NavigationLink;
