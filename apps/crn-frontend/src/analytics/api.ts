export const getMemberships = () => {
  const fakeData = [
    {
      id: '1',
      displayName: 'Team 1',
      workingGroupLeadershipRoleCount: 1,
      workingGroupPreviousLeadershipRoleCount: 2,
      workingGroupMemberCount: 3,
      workingGroupPreviousMemberCount: 4,
      interestGroupLeadershipRoleCount: 5,
      interestGroupPreviousLeadershipRoleCount: 6,
      interestGroupMemberCount: 7,
      interestGroupPreviousMemberCount: 8,
    },
    {
      id: '2',
      displayName: 'Team 2',
      workingGroupLeadershipRoleCount: 2,
      workingGroupPreviousLeadershipRoleCount: 3,
      workingGroupMemberCount: 4,
      workingGroupPreviousMemberCount: 5,
      interestGroupLeadershipRoleCount: 4,
      interestGroupPreviousLeadershipRoleCount: 3,
      interestGroupMemberCount: 2,
      interestGroupPreviousMemberCount: 1,
    },
  ];
  return fakeData;
};
