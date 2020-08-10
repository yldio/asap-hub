import React from 'react';
import { NavLink } from 'react-router-dom';
import css from '@emotion/css';

import { TextChildren, layoutStyles } from '../text';
import { perRem } from '../pixels';
import { fern, lead, charcoal } from '../colors';
import { useHasRouter } from '../hooks';

const activeClassName = 'active-link';
const styles = css({
  display: 'inline-block',
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${12 / perRem}em`,

  color: lead.rgb,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});
const activeStyles = css({
  paddingBottom: `${(12 - 4) / perRem}em`,
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
        <p css={layoutStyles}>{children}</p>
      </NavLink>
    );
  }

  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;
  return (
    <a href={href} css={[styles, active && activeStyles]}>
      <p css={layoutStyles}>{children}</p>
    </a>
  );
};

export default TabLink;
