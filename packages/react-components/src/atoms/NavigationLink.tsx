import React from 'react';
import { NavLink } from 'react-router-dom';
import css from '@emotion/css';

import { TextChildren } from '../text';
import { useHasRouter } from '../hooks';
import { color } from '../colors';
import { perRem, lineHeight } from '../pixels';

const activeClassName = 'active-link';
const hoverBackgroundColor = color(242, 245, 247);
const activeBackgroundColor = color(122, 210, 169, 0.18);

const styles = css({
  display: 'block',
  paddingTop: `${(12 + 1) / perRem}em`,
  paddingBottom: `${(12 - 1) / perRem}em`,

  color: 'unset',
  textDecoration: 'none',
  outline: 'none',

  borderRadius: `${6 / perRem}em`,
  ':hover, :focus': {
    backgroundColor: hoverBackgroundColor.rgb,
  },
});
const activeStyles = css({
  backgroundColor: activeBackgroundColor.rgba,
  ':hover, :focus': {
    backgroundColor: activeBackgroundColor.rgba,
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
  paddingLeft: `${12 / perRem}em`,
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
  if (useHasRouter()) {
    return (
      <NavLink
        to={href}
        activeClassName={activeClassName}
        css={[styles, { [`&.${activeClassName}`]: activeStyles }]}
      >
        <p css={textStyles}>
          <span css={iconStyles}>{icon}</span>
          {children}
        </p>
      </NavLink>
    );
  }

  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;
  return (
    <a href={href} css={[styles, active && activeStyles]}>
      <p css={textStyles}>
        <span css={iconStyles}>{icon}</span>
        {children}
      </p>
    </a>
  );
};

export default NavigationLink;
