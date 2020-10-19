import { ListUserResponse } from '@asap-hub/model';

const listUserResponseTeam: Omit<
  ListUserResponse['items'][0]['teams'][0],
  'id'
> = {
  displayName: 'Jakobsson, J',
  role: 'Core Leadership - Co-Investigator',
};

const listUserResponseItem: Omit<ListUserResponse['items'][0], 'id'> = {
  createdDate: '2020-09-07T17:36:54Z',
  lastModifiedDate: '2020-09-07T17:36:54Z',
  displayName: 'Person A',
  email: 'agnete.kirkeby@sund.ku.dk',
  firstName: 'Agnete',
  middleName: '',
  lastName: 'Kirkeby',
  jobTitle: 'Assistant Professor',
  institution: 'University of Copenhagen',
  teams: [],
  orcid: '0000-0001-8203-6901',
  orcidWorks: [],
  skills: [],
  questions: [],
};

export const createListUserResponse = (
  items: number,
  { teams = 1 } = {},
): ListUserResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) => ({
    ...listUserResponseItem,
    id: `u${itemIndex}`,
    displayName: `${listUserResponseItem.displayName} ${itemIndex + 1}`,
    teams: Array.from({ length: teams }, (__, teamIndex) => ({
      ...listUserResponseTeam,
      id: `u${itemIndex}-t${teamIndex}`,
    })),
  })),
});

export default createListUserResponse;
