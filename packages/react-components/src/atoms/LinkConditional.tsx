import { ComponentProps } from 'react';

import Link from './Link';

const LinkConditional: React.FC<ComponentProps<typeof Link>> = ({
  children,
  ...props
}) => (props.href ? <Link {...props}>{children}</Link> : <>{children}</>);

export default LinkConditional;
