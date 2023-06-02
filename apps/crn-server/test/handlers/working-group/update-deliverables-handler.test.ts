import { WorkingGroupDeliverable } from '@asap-hub/model';
import { workingGroupUpdateHandler } from '../../../src/handlers/working-group/update-deliverables-handler';
import {
  getWorkingGroupSquidexEvent,
  getWorkingGroupContentfulEvent,
  getWorkingGroupResponse,
} from '../../fixtures/working-groups.fixtures';
import { getDataProviderMock } from '../../mocks/data-provider.mock';

describe.each`
  cms             | getEventFunction
  ${`Squidex`}    | ${getWorkingGroupSquidexEvent}
  ${`Contentful`} | ${getWorkingGroupContentfulEvent}
`('Working Group update handler', ({ cms, getEventFunction }) => {
  const workingGroupDataProviderMock = getDataProviderMock();
  const handler = workingGroupUpdateHandler(workingGroupDataProviderMock);

  afterEach(() => jest.clearAllMocks());

  test(`updates Pending/In Progress deliverable statuses to Not Started/Incomplete if working group is completed for a ${cms} event`, async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A pending deliverable', status: 'Pending' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getEventFunction();
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

  test(`does not alter the status of complete deliverables for a ${cms} event`, async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A complete deliverable', status: 'Complete' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getEventFunction();
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

  test(`updates Not Started/Incomplete deliverable statuses to Pending/In Progress if working group is uncompleted for a ${cms} event`, async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A not-started deliverable', status: 'Not Started' },
      { description: 'An incomplete deliverable', status: 'Incomplete' },
    ];
    const event = getEventFunction();
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

  test(`does not send update request if no changes are required for a ${cms} event`, async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A pending deliverable', status: 'Pending' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getEventFunction();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: false, deliverables }),
    );

    await handler(event);

    expect(workingGroupDataProviderMock.update).not.toHaveBeenCalled();
  });

  test(`does not send update request if working group has no deliverables for a ${cms} event`, async () => {
    const event = getEventFunction();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: false, deliverables: [] }),
    );

    await handler(event);

    expect(workingGroupDataProviderMock.update).not.toHaveBeenCalled();
  });

  test(`throws without sending update request if fetch does not return a value for a ${cms} event`, async () => {
    const event = getEventFunction();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(null);

    await expect(handler(event)).rejects.toThrow();

    expect(workingGroupDataProviderMock.update).not.toHaveBeenCalled();
  });
});
