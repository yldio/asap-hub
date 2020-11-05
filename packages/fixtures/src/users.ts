import { ListUserResponse, UserTeam, UserResponse } from '@asap-hub/model';

const listUserResponseTeam: Omit<UserTeam, 'id'> = {
  displayName: 'Jakobsson, J',
  role: 'Project Manager',
};

const listUserResponseItem: Omit<ListUserResponse['items'][0], 'id'> = {
  createdDate: '2020-09-07T17:36:54Z',
  lastModifiedDate: '2020-09-07T17:36:54Z',
  displayName: 'Person A',
  email: 'agnete.kirkeby@sund.ku.dk',
  firstName: 'Agnete',
  lastName: 'Kirkeby',
  jobTitle: 'Assistant Professor',
  institution: 'University of Copenhagen',
  teams: [],
  orcid: '0000-0001-8203-6901',
  orcidWorks: [],
  skills: [],
  questions: [],
};

type FixtureOptions = {
  teams?: number;
};

export const createUserTeams = ({ teams = 1 }): UserTeam[] =>
  Array.from({ length: teams }, (__, teamIndex) => ({
    ...listUserResponseTeam,
    id: `t${teamIndex}`,
  }));

export const createUserResponse = (
  options: FixtureOptions = {},
  itemIndex = 0,
): UserResponse => ({
  ...listUserResponseItem,
  id: `u${itemIndex}`,
  displayName: `${listUserResponseItem.displayName} ${itemIndex + 1}`,
  teams: createUserTeams(options),
});

export const createListUserResponse = (
  items: number,
  options: FixtureOptions = {},
): ListUserResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createUserResponse(options, itemIndex),
  ),
});

export default createListUserResponse;
