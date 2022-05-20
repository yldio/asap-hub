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
});

const NavigationLink: React.FC<NavigationLinkProps> = ({
  icon,
  children,
  ...props
}) => (
  <Link {...props}>
    <div css={horizontalNavigationStyles}>
      {icon}
      {children}
    </div>
  </Link>
);

export default NavigationLink;
