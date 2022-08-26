import { ComponentProps } from 'react';

import WorkingGroupDetailHeader from '../organisms/WorkingGroupDetailHeader';

type WorkingGroupDetailPageProps = ComponentProps<
  typeof WorkingGroupDetailHeader
>;

const WorkingGroupDetailPage: React.FC<WorkingGroupDetailPageProps> = ({
  children,
  ...headerProps
}) => (
  <article>
    <WorkingGroupDetailHeader {...headerProps} />
    <main>{children}</main>
  </article>
);

export default WorkingGroupDetailPage;
