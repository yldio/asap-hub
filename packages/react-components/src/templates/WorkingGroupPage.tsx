import { ComponentProps } from 'react';

import WorkingGroupPageHeader from './WorkingGroupPageHeader';
import PageContraints from './PageConstraints';

const WorkingGroupPage: React.FC<
  ComponentProps<typeof WorkingGroupPageHeader>
> = ({ children, ...props }) => (
  <article>
    <WorkingGroupPageHeader {...props} />
    <PageContraints as="main">{children}</PageContraints>
  </article>
);

export default WorkingGroupPage;
