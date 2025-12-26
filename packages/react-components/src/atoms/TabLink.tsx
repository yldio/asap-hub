/** @jsxImportSource @emotion/react */
import { ComponentType, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { css, Theme } from '@emotion/react';

import { layoutStyles } from '../text';
import { rem } from '../pixels';
import { fern, neutral900, neutral1000 } from '../colors';
import { useHasRouter } from '../routing';
import IconProps from '../icons/props';

const borderBottomWidth = 4;

const styles = css({
  display: 'inline-block',
  paddingBottom: rem(16 + borderBottomWidth),

  color: neutral900.rgb,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});
const activeStyles = ({ colors: { primary500 = fern } = {} }: Theme) =>
  css({
    paddingBottom: rem(16 + borderBottomWidth),
    borderBottom: `solid ${rem(borderBottomWidth)} ${primary500.rgba}`,

    color: neutral1000.rgb,
    fontWeight: 'bold',
  });

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: rem(6),
});

/**
 * Check if the current path matches the link path using prefix matching.
 * e.g., /analytics/productivity matches /analytics/productivity/user
 */
const useIsActivePrefix = (href: string): boolean => {
  const location = useLocation();
  const linkPath = new URL(href, window.location.href).pathname;
  return (
    location.pathname === linkPath ||
    location.pathname.startsWith(`${linkPath}/`)
  );
};

interface TabLinkProps {
  readonly href: string;
  readonly Icon?: ComponentType<IconProps>;
  readonly children: ReactNode;
}
const TabLink: React.FC<TabLinkProps> = ({ href, children, Icon }) => {
  const hasRouter = useHasRouter();
  const isActivePrefix = hasRouter ? useIsActivePrefix(href) : false;

  // Fallback for non-router context: exact match only
  const active = hasRouter
    ? isActivePrefix
    : new URL(href, window.location.href).pathname === window.location.pathname;

  // Create inner content with properly colored icon
  const createInner = (isActive: boolean) => (
    <p
      css={({ components }: Theme) => [
        layoutStyles,
        css({ margin: 0 }),
        components?.TabLink?.layoutStyles,
      ]}
    >
      {Icon && (
        <span css={iconStyles}>
          <Icon color={isActive ? neutral1000.rgb : neutral900.rgb} />
        </span>
      )}
      {children}
    </p>
  );

  if (hasRouter) {
    // Use Link instead of NavLink to have full control over active state with prefix matching
    return (
      <Link
        to={href}
        style={{ textDecoration: 'none', color: 'unset' }}
        className={active ? 'active' : undefined}
      >
        <div
          css={(theme: Theme) => [
            styles,
            theme.components?.TabLink?.styles,
            active && activeStyles(theme),
          ]}
        >
          {createInner(active)}
        </div>
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={active ? 'active' : undefined}
      css={(theme: Theme) => [
        styles,
        theme.components?.TabLink?.styles,
        active && activeStyles(theme),
      ]}
    >
      {createInner(active)}
    </a>
  );
};

export default TabLink;
