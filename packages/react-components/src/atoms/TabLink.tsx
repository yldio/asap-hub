/** @jsxImportSource @emotion/react */
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { css, Theme } from '@emotion/react';

import { layoutStyles } from '../text';
import { rem } from '../pixels';
import { fern, lead, charcoal } from '../colors';
import { useHasRouter } from '../routing';

const activeClassName = 'active-link';
const styles = css({
  display: 'inline-block',
  paddingTop: rem(24),
  paddingBottom: rem(16),

  color: lead.rgb,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});
const activeStyles = ({ colors: { primary500 = fern } = {} }: Theme) =>
  css({
    paddingBottom: rem(16),
    borderBottom: `solid ${rem(4)} ${primary500.rgba}`,

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
          theme.components?.TabLink?.styles,
          { [`&.${activeClassName}`]: activeStyles(theme) },
        ]}
      >
        <p
          css={({ components }) => [
            layoutStyles,
            components?.TabLink?.layoutStyles,
          ]}
        >
          {children}
        </p>
      </NavLink>
    );
  }

  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;
  return (
    <a
      href={href}
      css={(theme) => [
        styles,
        theme.components?.TabLink?.styles,
        active && activeStyles(theme),
      ]}
    >
      <p
        css={({ components }) => [
          layoutStyles,
          components?.TabLink?.layoutStyles,
        ]}
      >
        {children}
      </p>
    </a>
  );
};

export default TabLink;
