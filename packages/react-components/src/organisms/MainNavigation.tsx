import { css, keyframes } from '@emotion/react';
import {
  about,
  discover,
  network,
  projects,
  sharedResearch,
  news,
  events,
  analytics,
} from '@asap-hub/routing';

import {
  rem,
  vminLinearCalc,
  largeDesktopScreen,
  mobileScreen,
  lineHeight,
} from '../pixels';
import { NavigationLink } from '../atoms';
import {
  railTooltipShownStyles,
  railTooltipStyles,
  railTooltipWrapperStyles,
} from '../atoms/NavigationLink';
import { charcoal, silver, steel } from '../colors';
import { crossQuery } from '../layout';
import {
  networkIcon,
  discoverIcon,
  aboutIcon,
  analyticsIcon,
  LibraryIcon,
  newsIcon,
  calendarIcon,
  ProjectIcon,
  collapseMenuIcon,
  expandMenuIcon,
} from '../icons';

const listStyles = css({
  listStyle: 'none',
  margin: 0,
  boxSizing: 'border-box',
  padding: rem(12),
  paddingTop: `max(${rem(12)}, ${vminLinearCalc(
    mobileScreen,
    18,
    largeDesktopScreen,
    12,
    'px',
  )})`,
  // 8px horizontal on desktop in every state, so the icon sits 8 + 16 = 24px
  // from the rail edge whether expanded or collapsed and never shifts. In the
  // 72px collapsed rail this makes each item a 56px box (16 + 24 + 16).
  [crossQuery]: {
    paddingLeft: rem(8),
    paddingRight: rem(8),
  },
  li: {
    marginBottom: '3px',
  },
});

// The collapse toggle is desktop-only; the mobile drawer has no collapse.
const toggleContainerStyles = css({
  display: 'none',
  [crossQuery]: {
    display: 'block',
    padding: `0 ${rem(8)}`,
  },
});
const dividerStyles = css({
  border: 'none',
  borderTop: `1px solid ${steel.rgb}`,
  margin: `${rem(12)} 0`,
});
const toggleButtonStyles = css({
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  // Left-aligned with the label when expanded (matches the nav items).
  justifyContent: 'flex-start',
  padding: rem(16),
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  // Match the sidebar labels (charcoal), not the lighter lead grey.
  color: charcoal.rgb,
  font: 'inherit',
  textAlign: 'left',
  borderRadius: rem(6),
  transition: 'background-color 100ms ease-in-out',
  // :focus-visible (not :focus) so a mouse click doesn't leave the background
  // stuck after the pointer moves away; keyboard focus still shows it.
  ':hover, :focus-visible': {
    backgroundColor: silver.rgb,
  },
});
// Matches the disabled nav items while the menu is still loading, and blocks
// collapsing until it is ready.
const toggleButtonDisabledStyles = css({
  opacity: 0.3,
  pointerEvents: 'none',
});
const toggleIconStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(lineHeight),
  height: rem(lineHeight),
  // 16px gap to the label when expanded, matching the nav items.
  paddingRight: rem(16),
});
const collapsedToggleIconStyles = css({
  paddingRight: 0,
});
// Suppress the browser's native <title> tooltip on the toggle icon so only the
// styled tooltip shows (mirrors the nav items).
const toggleIconNoTitleStyles = css({
  [crossQuery]: {
    svg: { pointerEvents: 'none' },
  },
});
const labelStyles = css({
  whiteSpace: 'nowrap',
});
const labelFadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});
const labelFadeInStyles = css({
  [crossQuery]: {
    animation: `${labelFadeIn} 150ms ease-in`,
  },
});

export interface MainNavigationProps {
  readonly userOnboarded: boolean;
  readonly canViewAnalytics?: boolean;
  readonly collapsed?: boolean;
  // True while the rail is animating open: keep labels hidden until full width.
  readonly animating?: boolean;
  readonly onToggleCollapse?: () => void;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  userOnboarded,
  canViewAnalytics = false,
  collapsed = false,
  animating = false,
  onToggleCollapse,
}) => {
  // Labels stay hidden while collapsed or mid-transition; once the rail reaches
  // full width they fade in (the frame after `animating` clears).
  const labelsHidden = collapsed || animating;
  const fadeInLabel = !collapsed && !animating;
  // Icons only centre (and the tooltip only arms) in the steady collapsed rail.
  // While the width animates in either direction the icons stay left-aligned so
  // they never jump position mid-transition.
  const railSettled = collapsed && !animating;
  return (
    <nav>
      <ul css={listStyles}>
        <li>
          <NavigationLink
            href={network({}).$}
            icon={networkIcon}
            enabled={userOnboarded}
            collapsed={railSettled}
            labelsHidden={labelsHidden}
            fadeInLabel={fadeInLabel}
          >
            Network
          </NavigationLink>
        </li>
        <li>
          <NavigationLink
            href={projects({}).$}
            icon={<ProjectIcon />}
            enabled={userOnboarded}
            collapsed={railSettled}
            labelsHidden={labelsHidden}
            fadeInLabel={fadeInLabel}
          >
            Projects
          </NavigationLink>
        </li>
        <li>
          <NavigationLink
            href={sharedResearch({}).$}
            icon={<LibraryIcon />}
            enabled={userOnboarded}
            collapsed={railSettled}
            labelsHidden={labelsHidden}
            fadeInLabel={fadeInLabel}
          >
            Shared Research
          </NavigationLink>
        </li>
        <li>
          <NavigationLink
            href={events({}).$}
            icon={calendarIcon}
            enabled={userOnboarded}
            collapsed={railSettled}
            labelsHidden={labelsHidden}
            fadeInLabel={fadeInLabel}
          >
            Calendar &amp; Events
          </NavigationLink>
        </li>
        <li>
          <NavigationLink
            href={news({}).$}
            icon={newsIcon}
            enabled={userOnboarded}
            collapsed={railSettled}
            labelsHidden={labelsHidden}
            fadeInLabel={fadeInLabel}
          >
            News
          </NavigationLink>
        </li>
        <li>
          <NavigationLink
            href={discover({}).$}
            icon={discoverIcon}
            enabled={userOnboarded}
            collapsed={railSettled}
            labelsHidden={labelsHidden}
            fadeInLabel={fadeInLabel}
          >
            Guides &amp; Tutorials
          </NavigationLink>
        </li>
        <li>
          <NavigationLink
            href={about({}).$}
            icon={aboutIcon}
            enabled={userOnboarded}
            collapsed={railSettled}
            labelsHidden={labelsHidden}
            fadeInLabel={fadeInLabel}
          >
            About ASAP
          </NavigationLink>
        </li>
        {canViewAnalytics && (
          <li>
            <NavigationLink
              href={analytics({}).$}
              icon={analyticsIcon}
              enabled={userOnboarded}
              collapsed={railSettled}
              labelsHidden={labelsHidden}
              fadeInLabel={fadeInLabel}
            >
              Analytics
            </NavigationLink>
          </li>
        )}
      </ul>
      {onToggleCollapse && (
        <div css={toggleContainerStyles}>
          <hr css={dividerStyles} />
          <button
            type="button"
            // Whole button is the tooltip trigger (like the nav item box), so
            // the tooltip shows wherever the hover background does.
            css={[
              toggleButtonStyles,
              railSettled && railTooltipShownStyles,
              !userOnboarded && toggleButtonDisabledStyles,
            ]}
            onClick={onToggleCollapse}
            disabled={!userOnboarded}
            aria-label={collapsed ? 'Expand Menu' : 'Collapse Menu'}
            aria-expanded={!collapsed}
          >
            <span css={railTooltipWrapperStyles}>
              <span
                css={[
                  toggleIconStyles,
                  labelsHidden && collapsedToggleIconStyles,
                  toggleIconNoTitleStyles,
                ]}
              >
                {collapsed ? expandMenuIcon : collapseMenuIcon}
              </span>
              {!labelsHidden && (
                <span css={[labelStyles, fadeInLabel && labelFadeInStyles]}>
                  Collapse Menu
                </span>
              )}
              {/* Same tooltip as the nav items when collapsed. */}
              <span role="tooltip" css={railTooltipStyles}>
                Expand Menu
              </span>
            </span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
