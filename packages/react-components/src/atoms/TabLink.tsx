import React from 'react';
import { NavLink } from 'react-router-dom';
import css from '@emotion/css';

import { TextChildren } from '../text';
import { perRem } from '../pixels';
import { fern, lead, charcoal } from '../colors';
import { useHasRouter } from '../hooks';

const activeClassName = 'active-link';
const styles = css({
  display: 'inline-block',
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${36 / perRem}em`,

  color: lead.rgb,
  textDecoration: 'none',
});
const activeStyles = css({
  paddingBottom: `${32 / perRem}em`,
  borderBottom: `solid ${4 / perRem}em ${fern.rgb}`,

  color: charcoal.rgb,
  fontWeight: 'bold',
});

interface TabLinkProps {
  readonly href: string;
  readonly children: TextChildren;
}
const TabLink: React.FC<TabLinkProps> = ({ href, children }) => {
  if (useHasRouter()) {
    return (
      <NavLink
        to={href}
        activeClassName={activeClassName}
        css={[styles, { [`&.${activeClassName}`]: activeStyles }]}
      >
        {children}
      </NavLink>
    );
  }

  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;
  return (
    <a href={href} css={[styles, active && activeStyles]}>
      {children}
    </a>
  );
};

export default TabLink;
