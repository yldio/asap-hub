import { ComponentProps } from 'react';

import NetworkPageHeader from './NetworkPageHeader';
import PageContraints from './PageConstraints';

const NetworkPage: React.FC<ComponentProps<typeof NetworkPageHeader>> = ({
  children,

  ...props
}) => (
  <article>
    <NetworkPageHeader {...props} />
    <PageContraints as="main">{children}</PageContraints>
  </article>
);

export default NetworkPage;
