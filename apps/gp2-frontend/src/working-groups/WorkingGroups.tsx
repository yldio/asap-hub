import { WorkingGroupsPage } from '@asap-hub/gp2-components';

const WorkingGroups: React.FC<Record<string, never>> = () => {
  const workingGroups = {
    items: [
      {
        id: '42',
        title: 'Working Group 42',
        members: [],
        shortDescription: 'This is a short description 42',
        leadingMembers: 'This is a list of leading members 42',
      },
      {
        id: '43',
        title: 'Working Group 43',
        members: [],
        shortDescription: 'This is a short description 43',
        leadingMembers: 'This is a list of leading members 43',
      },
      {
        id: '44',
        title: 'Working Group 44',
        members: [],
        shortDescription: 'This is a short description 44',
        leadingMembers: 'This is a list of leading members 44',
      },
    ],
    total: 1,
  };
  return <WorkingGroupsPage workingGroups={workingGroups} />;
};
export default WorkingGroups;
