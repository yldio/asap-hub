import { NavigationLink as Link, pixels } from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

const { rem } = pixels;

const horizontalNavigationStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: rem(80),
});

const NavigationLink: React.FC<ComponentProps<typeof Link>> = ({
  icon,
  children,
  ...props
}) => (
  <Link {...props}>
    <span css={horizontalNavigationStyles}>
      {icon}
      {children}
    </span>
  </Link>
);

export default NavigationLink;
