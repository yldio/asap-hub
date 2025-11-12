/** @jsxImportSource @emotion/react */
import { ComponentType, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { css, Theme } from '@emotion/react';

import { layoutStyles } from '../text';
import { rem } from '../pixels';
import { fern, neutral900, neutral1000 } from '../colors';
import { useHasRouter } from '../routing';
import IconProps from '../icons/props';

const borderBottomWidth = 4;

const activeClassName = 'active-link';
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

interface TabLinkProps {
  readonly href: string;
  readonly Icon?: ComponentType<IconProps>;
  readonly children: ReactNode;
}
const TabLink: React.FC<TabLinkProps> = ({ href, children, Icon }) => {
  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;

  // Create inner content with properly colored icon
  const createInner = (isActive: boolean) => (
    <p
      css={({ components }) => [
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

  if (useHasRouter()) {
    // For React Router v5, use isActive to determine match
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
        {createInner(active)}
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
      {createInner(active)}
    </a>
  );
};

export default TabLink;
