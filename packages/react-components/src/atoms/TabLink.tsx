/** @jsxImportSource @emotion/react */
import { ComponentType, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { css, Theme } from '@emotion/react';

import { layoutStyles } from '../text';
import { perRem, rem } from '../pixels';
import { fern, lead, charcoal } from '../colors';
import { useHasRouter } from '../routing';
import IconProps from '../icons/props';

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

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${6 / perRem}em`,
});

interface TabLinkProps {
  readonly href: string;
  readonly Icon?: ComponentType<IconProps>;
  readonly children: ReactNode;
}
const TabLink: React.FC<TabLinkProps> = ({ href, children, Icon }) => {
  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;

  const inner = (
    <p
      css={({ components }) => [
        layoutStyles,
        components?.TabLink?.layoutStyles,
      ]}
    >
      {Icon && (
        <span css={iconStyles}>
          <Icon color={active ? charcoal.rgb : lead.rgb} />
        </span>
      )}
      {children}
    </p>
  );

  if (useHasRouter()) {
    return (
      <NavLink
        to={href}
        className={({ isActive }) => (isActive ? activeClassName : '')}
        css={(theme) => [
          styles,
          theme.components?.TabLink?.styles,
          { [`&.${activeClassName}`]: activeStyles(theme) },
        ]}
      >
        {inner}
      </NavLink>
    );
  }

  return (
    <a
      href={href}
      css={(theme) => [
        styles,
        theme.components?.TabLink?.styles,
        active && activeStyles(theme),
      ]}
    >
      {inner}
    </a>
  );
};

export default TabLink;
