import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2, InstitutionsResponse } from '@asap-hub/model';

export const getUsers = jest.fn(
  async ({ pageSize }: GetListOptions): Promise<gp2.ListUserResponse> =>
    gp2Fixtures.createUsersResponse(pageSize ?? 10),
);

export const getUser = jest.fn(
  async (id: string): Promise<gp2.UserResponse> => ({
    ...gp2Fixtures.createUserResponse(),
    id,
  }),
);

export const patchUser = jest.fn(
  async (
    id: string,
    patch: gp2.UserPatchRequest,
  ): Promise<gp2.UserResponse> => ({
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
