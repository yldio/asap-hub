import { ComponentProps } from 'react';
import WorkingGroupsBody from '../organisms/WorkingGroupsBody';
import WorkingGroupsHeader from '../organisms/WorkingGroupsHeader';

type ResearchOutputPageProps = ComponentProps<typeof WorkingGroupsBody>;

const WorkingGroupsPage: React.FC<ResearchOutputPageProps> = (props) => (
  <article>
    <WorkingGroupsHeader />
    <main>
      <WorkingGroupsBody {...props} />
    </main>
  </article>
);

export default WorkingGroupsPage;
