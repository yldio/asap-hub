import {
  drawerQuery,
  NavigationLink as Link,
  pixels,
} from '@asap-hub/react-components';
import { css } from '@emotion/react';
import { ComponentProps } from 'react';

const { rem } = pixels;

const horizontalNavigationStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: rem(4),
  width: rem(80),
});

const NavigationLink: React.FC<ComponentProps<typeof Link>> = ({
  icon,
  children,
  ...props
}) => (
  <>
    <span
      css={css({
        [drawerQuery]: {
          display: 'none',
        },
      })}
    >
      <Link {...props} squareBorder>
        <span css={horizontalNavigationStyles}>
          {icon}
          {children}
        </span>
      </Link>
    </span>
    <span
      css={css({
        display: 'none',
        [drawerQuery]: {
          display: 'unset',
        },
      })}
    >
      <Link {...props} icon={icon} squareBorder>
        {children}
      </Link>
    </span>
  </>
);

export default NavigationLink;
