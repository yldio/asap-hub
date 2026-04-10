import {
  AimEvent,
  ProjectEvent,
  ProjectMembershipEvent,
} from '@asap-hub/model';
import { indexAimOpensearchHandler } from '../../../src/handlers/aim/opensearch-index-aim-handler';
import { createEventBridgeEventMock } from '../../helpers/events';

jest.mock('../../../src/utils/logger');

jest.mock('../../../scripts/opensearch/sync-opensearch-analytics', () => ({
  exportMetricToOpensearch: jest.fn().mockResolvedValue(undefined),
}));

import { exportMetricToOpensearch } from '../../../scripts/opensearch/sync-opensearch-analytics';

const mockExportMetricToOpensearch =
  exportMetricToOpensearch as jest.MockedFunction<
    typeof exportMetricToOpensearch
  >;

const triggerEvents: (AimEvent | ProjectEvent | ProjectMembershipEvent)[] = [
  'AimsPublished',
  'AimsUnpublished',
  'ProjectsPublished',
  'ProjectsUnpublished',
  'ProjectMembershipPublished',
  'ProjectMembershipUnpublished',
];

describe('OpenSearch Index Aim Handler', () => {
  const handler = indexAimOpensearchHandler();

  afterEach(() => jest.clearAllMocks());

  test.each(triggerEvents)(
    'should reindex both project-aims and project-milestones on %s',
    async (eventType) => {
      const event = createEventBridgeEventMock(
        { resourceId: 'resource-1' },
        eventType,
        'resource-1',
      );

      await handler(event);

      expect(mockExportMetricToOpensearch).toHaveBeenCalledWith('project-aims');
      expect(mockExportMetricToOpensearch).toHaveBeenCalledWith(
        'project-milestones',
      );
      expect(mockExportMetricToOpensearch).toHaveBeenCalledTimes(2);
    },
  );

  test('should throw when reindex fails', async () => {
    const error = new Error('Reindex failed');
    mockExportMetricToOpensearch.mockRejectedValueOnce(error);

    const event = createEventBridgeEventMock(
      { resourceId: 'aim-1' },
      'AimsPublished' as AimEvent,
      'aim-1',
    );

    await expect(handler(event)).rejects.toThrow('Reindex failed');
  });
});
