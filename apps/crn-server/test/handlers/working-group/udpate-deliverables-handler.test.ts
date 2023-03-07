import { workingGroupUpdateHandler } from '../../../src/handlers/working-group/update-deliverables-handler';
import {
  getWorkingGroupEvent,
  getWorkingGroupResponse,
} from '../../fixtures/working-groups.fixtures';
import { workingGroupDataProviderMock } from '../../mocks/working-group-data-provider.mock';
import { WorkingGroupDeliverable } from '@asap-hub/model';

describe('Working Group update handler', () => {
  const handler = workingGroupUpdateHandler(workingGroupDataProviderMock);

  afterEach(() => jest.clearAllMocks());

  test('loads data working group data from Squidex', async () => {
    const event = getWorkingGroupEvent();
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse(),
    );

    await handler(event);

    expect(workingGroupDataProviderMock.fetchById).toHaveBeenCalledWith(
      event.detail.payload.id,
    );
  });

  test('updates deliverable statuses if working group is completed', async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A pending deliverable', status: 'Pending' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getWorkingGroupEvent({ complete: true, deliverables });
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: true, deliverables }),
    );
    workingGroupDataProviderMock.patch.mockResolvedValueOnce();

    await handler(event);

    expect(workingGroupDataProviderMock.patch).toHaveBeenCalledWith(
      event.detail.payload.id,
      {
        deliverables: [
          { description: 'A pending deliverable', status: 'Not Started' },
          { description: 'An in progress deliverable', status: 'Incomplete' },
        ],
      },
    );
  });

  test('does not alter the status of complete deliverables', async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A complete deliverable', status: 'Complete' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getWorkingGroupEvent({ complete: true, deliverables });
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: true, deliverables }),
    );
    workingGroupDataProviderMock.patch.mockResolvedValueOnce();

    await handler(event);

    expect(workingGroupDataProviderMock.patch).toHaveBeenCalledWith(
      event.detail.payload.id,
      {
        deliverables: [
          { description: 'A complete deliverable', status: 'Complete' },
          { description: 'An in progress deliverable', status: 'Incomplete' },
        ],
      },
    );
  });

  test('updates deliverable statuses if working group is uncompleted', async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A not-started deliverable', status: 'Not Started' },
      { description: 'An incomplete deliverable', status: 'Incomplete' },
    ];
    const event = getWorkingGroupEvent({ complete: false, deliverables });
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: false, deliverables }),
    );
    workingGroupDataProviderMock.patch.mockResolvedValueOnce();

    await handler(event);

    expect(workingGroupDataProviderMock.patch).toHaveBeenCalledWith(
      event.detail.payload.id,
      {
        deliverables: [
          { description: 'A not-started deliverable', status: 'Pending' },
          { description: 'An incomplete deliverable', status: 'In Progress' },
        ],
      },
    );
  });

  test('does not send update request if no changes are required', async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A pending deliverable', status: 'Pending' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getWorkingGroupEvent({ complete: false, deliverables });
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: false, deliverables }),
    );
    workingGroupDataProviderMock.patch.mockResolvedValueOnce();

    await handler(event);

    expect(workingGroupDataProviderMock.patch).not.toHaveBeenCalled();
  });

  test('does not send update request if working group has no deliverables', async () => {
    const event = getWorkingGroupEvent({ complete: true, deliverables: [] });
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(
      getWorkingGroupResponse({ complete: false, deliverables: [] }),
    );
    workingGroupDataProviderMock.patch.mockResolvedValueOnce();

    await handler(event);

    expect(workingGroupDataProviderMock.patch).not.toHaveBeenCalled();
  });

  test('does not send update request if fetch does not return a value', async () => {
    const deliverables: WorkingGroupDeliverable[] = [
      { description: 'A pending deliverable', status: 'Pending' },
      { description: 'An in progress deliverable', status: 'In Progress' },
    ];
    const event = getWorkingGroupEvent({ complete: true, deliverables });
    workingGroupDataProviderMock.fetchById.mockResolvedValueOnce(null);
    workingGroupDataProviderMock.patch.mockResolvedValueOnce();

    await handler(event);

    expect(workingGroupDataProviderMock.patch).not.toHaveBeenCalled();
  });
});
