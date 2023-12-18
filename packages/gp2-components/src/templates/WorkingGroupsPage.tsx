import { layoutContentStyles } from '../layout';
import WorkingGroupsHeader from '../organisms/WorkingGroupsHeader';

const WorkingGroupsPage: React.FC = ({ children }) => (
  <article css={layoutContentStyles}>
    <WorkingGroupsHeader />
    <main>{children}</main>
  </article>
);

export default WorkingGroupsPage;
