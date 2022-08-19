import { ComponentProps } from 'react';
import WorkingGroupsBody from '../organisms/WorkingGroupsBody';
import WorkingGroupsHeader from '../organisms/WorkingGroupsHeader';

type WorkingGroupsPageProps = ComponentProps<typeof WorkingGroupsBody>;

const WorkingGroupsPage: React.FC<WorkingGroupsPageProps> = (props) => (
  <article>
    <WorkingGroupsHeader />
    <main>
      <WorkingGroupsBody {...props} />
    </main>
  </article>
);

export default WorkingGroupsPage;
