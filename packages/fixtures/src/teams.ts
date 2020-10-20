import { ListTeamResponse } from '@asap-hub/model';

const listTeamMember: Omit<ListTeamResponse['items'][0]['members'][0], 'id'> = {
  firstName: 'Mason',
  lastName: 'Carpenter',
  email: 'mason@car.com',
  displayName: 'Birdie Romeo',
  role: 'Lead PI',
};

const listTeamResponseItem: Omit<ListTeamResponse['items'][0], 'id'> = {
  displayName: 'Abu-Remaileh, M',
  applicationNumber: 'ASAP-000466',
  projectTitle:
    'Mapping the LRRK2 signalling pathway and its interplay with other Parkinson’s disease components',
  skills: [],
  members: [],
  lastModifiedDate: '2020-09-07T17:36:54Z',
};

export const createListTeamResponse = (
  items: number,
  { teamMembers = 0 } = {},
): ListTeamResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) => ({
    ...listTeamResponseItem,
    id: `t${itemIndex}`,
    displayName: `${listTeamResponseItem.displayName} ${itemIndex + 1}`,
    members: Array.from({ length: teamMembers }, (__, memberIndex) => ({
      ...listTeamMember,
      id: `t${itemIndex}-m${memberIndex}`,
    })),
  })),
});

export default createListTeamResponse;
