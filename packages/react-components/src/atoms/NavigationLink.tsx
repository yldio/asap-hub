/** @jsxImportSource @emotion/react */
import { css, keyframes, Theme } from '@emotion/react';
import { PropsWithChildren } from 'react';
import { NavLink, useLocation } from 'react-router';
import { activePrimaryStyles } from '../button';
import { charcoal, lead, paper, silver } from '../colors';
import { crossQuery } from '../layout';
import { useBlockedClick } from '../navigation';
import { lineHeight, rem } from '../pixels';
import { useHasRouter } from '../routing';
import { isInternalLink } from '../utils';

const styles = css({
  display: 'block',
  color: 'unset',
  cursor: 'pointer',
  padding: rem(16),
  stroke: lead.rgb,
  svg: {
    stroke: charcoal.rgb,
  },
  textDecoration: 'none',
  outline: 'none',
  borderRadius: rem(6),
  transition: 'background-color 100ms ease-in-out, color 100ms ease-in-out',
  ':hover, :focus': {
    backgroundColor: silver.rgb,
  },
  // Reveal the collapsed-rail tooltip whenever the whole item is hovered (not
  // just the icon), matching the hover background. :focus-visible (not
  // :focus-within) so a mouse click doesn't leave the tooltip stuck once the
  // pointer moves away; keyboard focus still shows it. No-op for items without
  // a tooltip (expanded menu, mobile drawer, other Navigation uses).
  [crossQuery]: {
    '&:hover [role="tooltip"], &:focus-visible [role="tooltip"]': {
      visibility: 'visible',
      opacity: 1,
    },
  },
});

const textStyles = css({
  margin: 0,
  display: 'flex',
  alignItems: 'center',
});
const iconStyles = css({
  display: 'inline-block',
  width: rem(lineHeight),
  height: rem(lineHeight),
  // 16px gap between icon and label when expanded (per design).
  paddingRight: rem(16),
});
const collapsedIconStyles = css({
  [crossQuery]: {
    paddingRight: 0,
  },
});
// Stop the icon SVG from receiving pointer events on the collapsed rail so the
// browser's native <title> tooltip never appears alongside our styled one. The
// item box still handles the hover (background + tooltip).
const iconNoTitleStyles = css({
  [crossQuery]: {
    svg: { pointerEvents: 'none' },
  },
});
const collapsedLabelStyles = css({
  [crossQuery]: {
    display: 'none',
  },
});
const labelFadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});
// Only applied on desktop once the rail has reached full width, so labels
// appear after the expand animation rather than wrapping inside a narrow rail.
const labelFadeInStyles = css({
  [crossQuery]: {
    animation: `${labelFadeIn} 150ms ease-in`,
  },
});

const disableStyles = css({
  opacity: 0.3,
  pointerEvents: 'none',
});

const squareBorderStyles = css({
  borderRadius: 'unset',
});

// Tooltip shown to the right of a collapsed icon rail item on hover/focus.
// Hidden on mobile where the drawer already shows the full label. Exported so
// the collapse/expand toggle can reuse the exact same tooltip treatment.
export const railTooltipWrapperStyles = css({
  position: 'relative',
  display: 'flex',
  flex: 1,
});
export const railTooltipStyles = css({
  display: 'none',
  [crossQuery]: {
    display: 'block',
    visibility: 'hidden',
    opacity: 0,
    transition: 'opacity 100ms ease-in-out',
    position: 'absolute',
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: rem(16),
    zIndex: 1,
    pointerEvents: 'none',

    backgroundColor: charcoal.rgb,
    color: paper.rgb,
    borderRadius: rem(4),
    padding: `${rem(6)} ${rem(12)}`,
    whiteSpace: 'nowrap',
    fontWeight: 'normal',

    '::before': {
      content: '""',
      position: 'absolute',
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: `${rem(5)} solid transparent`,
      borderBottom: `${rem(5)} solid transparent`,
      borderRight: `${rem(5)} solid ${charcoal.rgb}`,
    },
  },
});
// Applied to the collapse/expand toggle button. :focus-visible (not
// :focus-within) so clicking the button doesn't leave its tooltip stuck after
// the pointer moves away; keyboard focus still reveals it.
export const railTooltipShownStyles = css({
  [crossQuery]: {
    '&:hover [role="tooltip"], &:focus-visible [role="tooltip"]': {
      visibility: 'visible',
      opacity: 1,
    },
  },
});

type NavigationLinkProps = NavigationProps & {
  readonly icon?: JSX.Element;
  readonly collapsed?: boolean;
  // Hide the label while the rail is collapsed or still animating open, so it
  // never wraps inside a not-yet-full-width rail.
  readonly labelsHidden?: boolean;
  // Fade the label in once the rail has finished expanding.
  readonly fadeInLabel?: boolean;
} & PropsWithChildren;
const NavigationLink: React.FC<NavigationLinkProps> = ({
  icon,
  children,
  collapsed = false,
  labelsHidden = collapsed,
  fadeInLabel = false,
  ...props
}) =>
  labelsHidden ? (
    // Icon-only: the icon keeps its natural 16px left padding (from `styles`)
    // so it never shifts horizontally between the collapsed rail, the expanded
    // menu, or during either width animation.
    <Navigation {...props}>
      {/* The whole item box (in Navigation) is the hover trigger, so the
          tooltip shows wherever the hover background does, not only on the
          icon. */}
      <span css={railTooltipWrapperStyles}>
        <p css={textStyles}>
          {icon && (
            <span css={[iconStyles, collapsedIconStyles, iconNoTitleStyles]}>
              {icon}
            </span>
          )}
          <span css={collapsedLabelStyles}>{children}</span>
        </p>
        <span role="tooltip" css={railTooltipStyles}>
          {children}
        </span>
      </span>
    </Navigation>
  ) : (
    <Navigation {...props}>
      {/* Keep the DOM identical to the non-animated case; only when expanding do
          we wrap the label to fade *just the text* in (never the icon, so the
          icon does not flash), leaving other consumers untouched. */}
      <p css={textStyles}>
        {icon && <span css={iconStyles}>{icon}</span>}
        {fadeInLabel ? (
          <span css={labelFadeInStyles}>{children}</span>
        ) : (
          children
        )}
      </p>
    </Navigation>
  );

interface NavigationProps {
  readonly href: string;
  readonly enabled?: boolean;
  readonly squareBorder?: boolean;
}
export const Navigation: React.FC<NavigationProps & PropsWithChildren> = ({
  href,
  children,
  enabled = true,
  squareBorder,
}) => {
  const blockedClick = useBlockedClick();
  const [internal, url] = isInternalLink(href);
  const location = useLocation();

  if (useHasRouter() && internal) {
    // Use prefix matching to highlight parent sections when viewing subsections
    // e.g., /network should be highlighted when at /network/interest-groups
    const linkPath = url.split('#')[0];
    const isActive =
      linkPath &&
      (location.pathname === linkPath ||
        location.pathname.startsWith(`${linkPath}/`));

    return (
      <NavLink
        to={url}
        style={{ textDecoration: 'none', color: 'unset' }}
        className={enabled && isActive ? 'active' : undefined}
        onClick={blockedClick}
      >
        <div
          css={({ colors, components }: Theme) => [
            styles,
            squareBorder && squareBorderStyles,
            enabled && isActive && activePrimaryStyles(colors),
            !enabled && disableStyles,
            components?.NavigationLink?.styles,
          ]}
        >
          {children}
        </div>
      </NavLink>
    );
  }
  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;

  return (
    <a
      href={url}
      className={active ? 'active' : undefined}
      css={({ colors, components }: Theme) => [
        styles,
        squareBorder && squareBorderStyles,
        active && activePrimaryStyles(colors),
        !enabled && disableStyles,
        components?.NavigationLink?.styles,
      ]}
    >
      {children}
    </a>
  );
};

export default NavigationLink;
