import { NavigationLink as Link } from '@asap-hub/react-components';
import { css } from '@emotion/react';

interface NavigationLinkProps {
  readonly href: string;
  readonly icon?: JSX.Element;
}

const horizontalNavigationStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '80px',
});

const NavigationLink: React.FC<NavigationLinkProps> = ({
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
