import { pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import onboardingCompletedIcon from '../icons/onboarding-completed-icon';
import onboardingDisabledIcon from '../icons/onboarding-disabled-icon';

import { mobileQuery } from '../layout';
import colors from '../templates/colors';

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
const textStyles = css({ margin: 0, display: 'inline-flex', gap: rem(8) });
const activeStyles = css({
  paddingBottom: rem(16),
  borderBottom: `solid ${rem(4)} ${colors.primary500.rgba}`,
  color: colors.neutral1000.rgba,
  fontWeight: 'bold',
  [mobileQuery]: {
    paddingBottom: rem(8),
    display: 'unset',
  },
  svg: {
    display: 'none',
  },
  span: { display: 'inline-block' },
});

const mobileStyle = css({
  [mobileQuery]: {
    display: 'none',
  },
});

interface OnboardedTabLinkProps {
  readonly href: string;
  readonly completed?: boolean;
  readonly disabled?: boolean;
  readonly index: number;
  readonly children: ReactNode;
}

const OnboardedTabLink: React.FC<OnboardedTabLinkProps> = ({
  href,
  children,
  disabled = false,
  index,
}) =>
  disabled ? (
    <div css={[styles, mobileStyle, disabledStyles]}>
      <p css={textStyles}>
        {onboardingDisabledIcon}
        {children}
      </p>
    </div>
  ) : (
    <NavLink
      to={href}
      activeClassName={'active-link'}
      css={[styles, mobileStyle, { [`&.active-link`]: activeStyles }]}
    >
      <p css={textStyles}>
        <span
          css={css({
            display: 'none',
            width: rem(24),
            height: rem(24),
            borderRadius: rem(12),
            backgroundColor: colors.info500.rgb,
            color: colors.neutral000.rgb,
            textAlign: 'center',
          })}
        >
          {index}
        </span>
        {onboardingCompletedIcon}
        {children}
      </p>
    </NavLink>
  );

export default OnboardedTabLink;
