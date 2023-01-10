import { css } from '@emotion/react';
import { NavHashLink } from 'react-router-hash-link';
import { activePrimaryStyles } from '../button';
import { charcoal, lead, silver } from '../colors';
import {
  largeDesktopScreen,
  lineHeight,
  mobileScreen,
  perRem,
  vminLinearCalc,
} from '../pixels';
import { useHasRouter } from '../routing';
import { isInternalLink } from '../utils';

const activeClassName = 'active-link';

const styles = css({
  display: 'block',
  paddingLeft: `${12 / perRem}em`,
  paddingRight: `${12 / perRem}em`,
  paddingTop: vminLinearCalc(
    mobileScreen,
    12 + 1,
    largeDesktopScreen,
    15 + 1,
    'px',
  ),
  paddingBottom: vminLinearCalc(
    mobileScreen,
    12 - 1,
    largeDesktopScreen,
    15 - 1,
    'px',
  ),
  color: 'unset',
  textDecoration: 'none',
  outline: 'none',
  stroke: lead.rgb,
  borderRadius: `${6 / perRem}em`,
  transition: 'background-color 100ms ease-in-out, color 100ms ease-in-out',
  ':hover, :focus': {
    backgroundColor: silver.rgb,
  },
  svg: {
    stroke: charcoal.rgb,
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
  paddingRight: `${14 / perRem}em`,
});

const disableStyles = css({
  opacity: 0.3,
  pointerEvents: 'none',
});

const squareBorderStyles = css({
  borderRadius: 'unset',
});

const noStrokeStyles = css({
  stroke: 'initial',
  svg: { stroke: 'initial' },
  '&.active-link > p > span > svg': { stroke: 'initial' },
});

interface NavigationLinkProps {
  readonly href: string;
  readonly enabled?: boolean;
  readonly icon?: JSX.Element;
  readonly squareBorder?: boolean;
  readonly hasStrokeWidth?: boolean;
}
const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  enabled = true,
  icon,
  squareBorder = false,
  children,
  hasStrokeWidth = true,
}) => {
  const [internal, url] = isInternalLink(href);

  if (useHasRouter() && internal) {
    return (
      <NavHashLink
        to={url}
        activeClassName={activeClassName}
        css={({ colors }) => [
          styles,
          !hasStrokeWidth && noStrokeStyles,
          squareBorder && squareBorderStyles,
          { [`&.${activeClassName}`]: activePrimaryStyles(colors) },
          !enabled && disableStyles,
        ]}
        smooth
        isActive={(match) => enabled && !!match && match.url === url}
      >
        <p css={textStyles}>
          {icon && <span css={iconStyles}>{icon}</span>}
          {children}
        </p>
      </NavHashLink>
    );
  }
  const active =
    new URL(href, window.location.href).pathname === window.location.pathname;

  return (
    <a
      href={url}
      css={({ colors }) => [
        styles,
        !hasStrokeWidth && noStrokeStyles,
        squareBorder && squareBorderStyles,
        active && activePrimaryStyles(colors),
        !enabled && disableStyles,
      ]}
    >
      <p css={textStyles}>
        {icon && <span css={iconStyles}>{icon}</span>}
        {children}
      </p>
    </a>
  );
};

export default NavigationLink;
