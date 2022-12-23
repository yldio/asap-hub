import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { mobileQuery } from '../layout';
import colors from '../templates/colors';

interface OnboardedTabLinkProps {
  readonly href: string;
  readonly disabled?: boolean;
  readonly children: ReactNode;
}

const { rem } = pixels;

const styles = css({
  display: 'inline-block',
  color: colors.neutral900.rgba,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
});

const disabledStyles = css({
  color: colors.neutral700.rgba,
});

const activeStyles = css({
  paddingBottom: rem(16),
  borderBottom: `solid ${rem(4)} ${colors.primary500.rgba}`,
  color: colors.neutral1000.rgba,
  fontWeight: 'bold',
  [mobileQuery]: {
    paddingBottom: rem(8),
    display: 'unset',
  },
});

const mobileStyle = css({
  [mobileQuery]: {
    display: 'none',
  },
});

const OnboardedTabLink: React.FC<OnboardedTabLinkProps> = ({
  href,
  children,
  disabled = false,
}) =>
  disabled ? (
    <div css={[styles, mobileStyle, disabledStyles]}>
      <p css={css({ margin: 0 })}>{children}</p>
    </div>
  ) : (
    <NavLink
      to={href}
      activeClassName={'active-link'}
      css={[styles, mobileStyle, { [`&.active-link`]: activeStyles }]}
    >
      <p css={css({ margin: 0 })}>{children}</p>
    </NavLink>
  );

export default OnboardedTabLink;
