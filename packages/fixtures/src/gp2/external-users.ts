import { gp2 } from '@asap-hub/model';

export const createExternalUserResponse = (): gp2.ExternalUserResponse => ({
  id: 'some-id',
  displayName: 'Tony Stark',
});

export const createListExternalUserResponse =
  (): gp2.ListExternalUserResponse => ({
    total: 1,
    items: [createExternalUserResponse()],
  });
