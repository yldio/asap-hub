import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { css, Theme } from '@emotion/react';

import { layoutStyles } from '../text';
import { perRem } from '../pixels';
import { fern, lead, charcoal } from '../colors';
import { useHasRouter } from '../routing';

const activeClassName = 'active-link';
const styles = css({
  display: 'inline-block',
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${12 / perRem}em`,

  color: lead.rgb,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});
const activeStyles = ({ colors: { primary500 = fern } = {} }: Theme) =>
  css({
    paddingBottom: `${(12 - 4) / perRem}em`,
    borderBottom: `solid ${4 / perRem}em ${primary500.rgba}`,

    color: charcoal.rgb,
    fontWeight: 'bold',
  });

interface TabLinkProps {
  readonly href: string;
  readonly children: ReactNode;
}
const TabLink: React.FC<TabLinkProps> = ({ href, children }) => {
  if (useHasRouter()) {
    return (
      <NavLink
        to={href}
        activeClassName={activeClassName}
        css={(theme) => [
          styles,
          { [`&.${activeClassName}`]: activeStyles(theme) },
        ]}
      >
        <p css={layoutStyles}>{children}</p>
      </NavLink>
    );
  }

  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;
  return (
    <a href={href} css={(theme) => [styles, active && activeStyles(theme)]}>
      <p css={layoutStyles}>{children}</p>
    </a>
  );
};

export default TabLink;
