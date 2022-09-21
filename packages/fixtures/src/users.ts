import { ListUserResponse, UserResponse, UserTeam } from '@asap-hub/model';
import { createLabs } from './labs';

const listUserResponseTeam: Omit<UserTeam, 'id'> = {
  displayName: 'Jakobsson, J',
  role: 'Project Manager',
};

export const listUserResponseItem: Omit<ListUserResponse['items'][0], 'id'> = {
  createdDate: '2020-09-07T17:36:54Z',
  lastModifiedDate: '2020-09-07T17:36:54Z',
  onboarded: true,
  displayName: 'Person A',
  email: 'agnete.kirkeby@sund.ku.dk',
  firstName: 'Agnete',
  lastName: 'Kirkeby',
  jobTitle: 'Assistant Professor',
  institution: 'University of Copenhagen',
  country: 'Denmark',
  city: 'Copenhagen',
  teams: [],
  orcid: '0000-0001-8203-6901',
  orcidWorks: [],
  expertiseAndResourceTags: [],
  questions: [],
  role: 'Grantee',
  social: {
    github: '',
    googleScholar: '',
    linkedIn: '',
    orcid: '',
    researchGate: '',
    researcherId: '',
    twitter: '',
  },
  labs: [],
};

type FixtureOptions = {
  teams?: number;
  labs?: number;
};

export const createUserTeams = ({
  teams = 1,
}: {
  teams?: number;
}): UserTeam[] =>
  Array.from({ length: teams }, (_, teamIndex) => ({
    ...listUserResponseTeam,
    id: `team-id-${teamIndex}`,
  }));

export const createUserResponse = (
  options: FixtureOptions = {},
  itemIndex = 0,
): UserResponse => ({
  ...listUserResponseItem,
  id: `user-id-${itemIndex}`,
  displayName: `${listUserResponseItem.displayName} ${itemIndex + 1}`,
  teams: createUserTeams(options),
  labs: createLabs(options),
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
