import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2, InstitutionsResponse } from '@asap-hub/model';

export const getUsers = jest.fn(
  async ({ pageSize }: GetListOptions): Promise<gp2.ListUserResponse> =>
    gp2Fixtures.createUsersResponse(pageSize ?? 10),
);
export const getExternalUsers = jest.fn(
  async (): Promise<gp2.ListExternalUserResponse> =>
    gp2Fixtures.createListExternalUserResponse(),
);

export const getUser = jest.fn(
  async (id: string): Promise<gp2.UserResponse> => ({
    ...gp2Fixtures.createUserResponse(),
    id,
  }),
);

export const patchUser = jest.fn(
  async (id: string, patch: gp2.UserResponse): Promise<gp2.UserResponse> => ({
    ...gp2Fixtures.createUserResponse(),
    ...patch,
    id,
  }),
);

export const postUserAvatar = jest.fn(
  async (
    id: string,
    post: gp2.UserAvatarPostRequest,
  ): Promise<gp2.UserResponse> => {
    const user = await getUser(id);
    return {
      ...user,
      avatarUrl: `url: ${post.avatar}`,
    };
  },
);

export const getInstitutions = jest.fn(
  async (): Promise<InstitutionsResponse> => ({
    number_of_results: 20,
    time_taken: 0,
    items: Array.from({ length: 20 }).map((_, i) => ({
      name: `Institution ${i + 1}`,
      id: `id-${i}`,
      email_address: 'example@example.com',
      status: '',
      wikipedia_url: '',
      established: 1999,
      aliases: [],
      acronyms: [],
      links: [],
      types: [],
    })),
  }),
);

export const getContributingCohorts = jest.fn(
  async (): Promise<gp2.ContributingCohortResponse[]> => [
    {
      id: '9cfcda7e-6902-4ca0-b7a2-9fab83f20c75',
      name: 'AGPDS',
    },
    {
      id: '57cc1e0b-82c3-4578-8d90-840ecaa45a3a',
      name: 'Arizona Brain Bank Brain and body donation programme (BBDP)',
    },
    {
      id: 'c8ace8ba-0527-4571-9cca-f696d439c096',
      name: 'BADGE-PD',
    },
    {
      id: '670ed9ad-5451-4004-801b-57ddc0feac3d',
      name: 'BCM-UMD',
    },
  ],
);
