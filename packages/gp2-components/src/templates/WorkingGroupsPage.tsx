import WorkingGroupsHeader from '../organisms/WorkingGroupsHeader';

const WorkingGroupsPage: React.FC = ({ children }) => (
  <article>
    <WorkingGroupsHeader />
    <main>{children}</main>
  </article>
);

export default WorkingGroupsPage;
