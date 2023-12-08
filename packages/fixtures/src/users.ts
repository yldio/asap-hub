import {
  ListUserResponse,
  UserResponse,
  UserTeam,
  UserListItemAlgoliaResponse,
  WithAlgoliaTags,
  UserListAlgoliaResponse,
  UserListItemResponse,
} from '@asap-hub/model';
import { createLabs } from './labs';

const listUserResponseTeam: Omit<UserTeam, 'id'> = {
  displayName: 'Jakobsson, J',
  role: 'Project Manager',
};

export const listUserResponseItem: Omit<ListUserResponse['items'][0], 'id'> = {
  createdDate: '2020-09-07T17:36:54Z',
  displayName: 'Person A',
  firstName: 'Agnete',
  lastName: 'Kirkeby',
  jobTitle: 'Assistant Professor',
  institution: 'University of Copenhagen',
  country: 'Denmark',
  city: 'Copenhagen',
  role: 'Grantee',
  onboarded: true,
  teams: [],
  labs: [],
  _tags: [],
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
  lastModifiedDate: '2020-09-07T17:36:54Z',
  email: 'agnete.kirkeby@sund.ku.dk',
  orcid: '0000-0001-8203-6901',
  orcidWorks: [],
  expertiseAndResourceTags: [],
  questions: [],
  social: {
    github: '',
    googleScholar: '',
    linkedIn: '',
    orcid: '',
    researchGate: '',
    researcherId: '',
    twitter: '',
  },
  workingGroups: [],
  interestGroups: [],

  id: `user-id-${itemIndex}`,
  displayName: `${listUserResponseItem.displayName} ${itemIndex + 1}`,
  teams: createUserTeams(options),
  labs: createLabs(options),
});

export const createUserListItemResponse = (
  options: FixtureOptions = {},
  itemIndex = 0,
): UserListItemResponse => ({
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
    createUserListItemResponse(options, itemIndex),
  ),
});

export const createUserAlgoliaResponse = (
  options: FixtureOptions = {},
  itemIndex = 0,
): WithAlgoliaTags<UserListItemAlgoliaResponse> => {
  const {
    alumniSinceDate,
    avatarUrl,
    city,
    country,
    createdDate,
    degree,
    displayName,
    expertiseAndResourceTags,
    firstName,
    id,
    institution,
    jobTitle,
    labs,
    lastName,
    membershipStatus,
    teams,
  } = createUserResponse(options, itemIndex);

  return {
    alumniSinceDate,
    avatarUrl,
    city,
    country,
    createdDate,
    degree,
    displayName,
    firstName,
    id,
    institution,
    jobTitle,
    labs,
    lastName,
    membershipStatus,
    teams,
    _tags: expertiseAndResourceTags,
  };
};

export const createUserListAlgoliaResponse = (
  items: number,
  options: FixtureOptions = {},
): UserListAlgoliaResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createUserAlgoliaResponse(options, itemIndex),
  ),
});

export default createListUserResponse;
