import encode from 'jwt-encode';
import { GetAccessToken } from '../auth';

export const getAccessTokenMock: jest.MockedFunction<GetAccessToken> = jest
  .fn()
  .mockReturnValue('some-token');

export const getMockToken = (expDate: Date = new Date()) =>
  encode(
    {
      exp: Math.floor((expDate.getTime() + 1500) / 1000),
      nbf: Math.floor(new Date().getTime() / 1000),
    },
    'secret',
  );
