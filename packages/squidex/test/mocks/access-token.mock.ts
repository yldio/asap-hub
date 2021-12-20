import { GetAccessToken } from '../../src/auth';

export const getAccessTokenMock: jest.MockedFunction<GetAccessToken> = jest
  .fn()
  .mockReturnValue('some-token');
