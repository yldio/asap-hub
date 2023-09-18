import { WorkingGroupDeliverable } from '@asap-hub/model';
import { workingGroupUpdateHandler } from '../../../src/handlers/working-group/update-deliverables-handler';
import {
  getWorkingGroupContentfulEvent,
  getWorkingGroupResponse,
} from '../../fixtures/working-groups.fixtures';
import { getDataProviderMock } from '../../mocks/data-provider.mock';

jest.mock('../../../src/utils/logger');
describe('Working Group update handler', () => {
  const workingGroupDataProviderMock = getDataProviderMock();
  const handler = workingGroupUpdateHandler(workingGroupDataProviderMock);

  afterEach(() => jest.clearAllMocks());

  test(`updates Pending/In Progress deliverable statuses to Not Started/Incomplete if working group is completed for a working group publish event`, async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A pending deliverable', status: 'Pending' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getWorkingGroupContentfulEvent();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: true, deliverables }),
    );

    await handler(event);

    expect(workingGroupDataProviderMock.update).toHaveBeenCalledWith(
      event.detail.resourceId,
      {
        deliverables: [
          { description: 'A pending deliverable', status: 'Not Started' },
          { description: 'An in progress deliverable', status: 'Incomplete' },
        ],
      },
    );
  });

  test(`does not alter the status of complete deliverables for a working group publish event`, async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A complete deliverable', status: 'Complete' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getWorkingGroupContentfulEvent();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: true, deliverables }),
    );

    await handler(event);

    expect(workingGroupDataProviderMock.update).toHaveBeenCalledWith(
      event.detail.resourceId,
      {
        deliverables: [
          { description: 'A complete deliverable', status: 'Complete' },
          { description: 'An in progress deliverable', status: 'Incomplete' },
        ],
      },
    );
  });

  test(`updates Not Started/Incomplete deliverable statuses to Pending/In Progress if working group is uncompleted for a working group publish event`, async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A not-started deliverable', status: 'Not Started' },
      { description: 'An incomplete deliverable', status: 'Incomplete' },
    ];
    const event = getWorkingGroupContentfulEvent();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: false, deliverables }),
    );

    await handler(event);

    expect(workingGroupDataProviderMock.update).toHaveBeenCalledWith(
      event.detail.resourceId,
      {
        deliverables: [
          { description: 'A not-started deliverable', status: 'Pending' },
          { description: 'An incomplete deliverable', status: 'In Progress' },
        ],
      },
    );
  });

  test(`does not send update request if no changes are required for a working group publish event`, async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A pending deliverable', status: 'Pending' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getWorkingGroupContentfulEvent();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: false, deliverables }),
    );

    await handler(event);

    expect(workingGroupDataProviderMock.update).not.toHaveBeenCalled();
  });

  test(`does not send update request if working group has no deliverables for a working group publish event`, async () => {
    const event = getWorkingGroupContentfulEvent();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: false, deliverables: [] }),
    );

    await handler(event);

    expect(workingGroupDataProviderMock.update).not.toHaveBeenCalled();
  });

  test(`throws without sending update request if fetch does not return a value for a working group publish event`, async () => {
    const event = getWorkingGroupContentfulEvent();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(null);

    await expect(handler(event)).rejects.toThrow();

    expect(workingGroupDataProviderMock.update).not.toHaveBeenCalled();
  });
});
