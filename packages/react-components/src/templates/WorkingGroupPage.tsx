import { ComponentProps } from 'react';

import WorkingGroupPageHeader from './WorkingGroupPageHeader';
import PageConstraints from './PageConstraints';

const WorkingGroupPage: React.FC<
  ComponentProps<typeof WorkingGroupPageHeader> & { children?: React.ReactNode }
> = ({ children, ...props }) => (
  <article>
    <WorkingGroupPageHeader {...props} />
    <PageConstraints as="main">{children}</PageConstraints>
  </article>
);

export default WorkingGroupPage;
