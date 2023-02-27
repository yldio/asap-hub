import { gp2 as gp2Model } from '@asap-hub/model';
import { EventController } from '@asap-hub/server-common';

export const eventControllerMock: jest.Mocked<
  EventController<
    gp2Model.EventResponse,
    gp2Model.ListEventResponse,
    gp2Model.EventCreateRequest,
    gp2Model.EventUpdateRequest
  >
> = {
  create: jest.fn(),
  fetch: jest.fn(),
  fetchById: jest.fn(),
  fetchByGoogleId: jest.fn(),
  update: jest.fn(),
};
