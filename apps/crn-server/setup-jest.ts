import * as contentful from '@asap-hub/contentful';
import { getContentfulEnvironmentMock } from './test/mocks/contentful-rest-client.mock';

jest.mock('@asap-hub/contentful', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@asap-hub/contentful'),
  };
});

jest
  .spyOn(contentful, 'getRestClient')
  .mockResolvedValue(new Promise(() => getContentfulEnvironmentMock));
