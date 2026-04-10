import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { MilestoneEvent, WebhookDetail } from '@asap-hub/model';
import { indexMilestoneOpensearchHandler } from '../../../src/handlers/milestone/opensearch-index-milestone-handler';
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

const getMilestoneWebhookDetail = (
  id: string,
): WebhookDetail<ContentfulWebhookPayload<'milestones'>> => ({
  resourceId: id,
  metadata: { tags: [] },
  sys: {
    type: 'Entry',
    id,
    space: { sys: { type: 'Link', linkType: 'Space', id: 'space-id' } },
    environment: {
      sys: { type: 'Link', linkType: 'Environment', id: 'env-id' },
    },
    contentType: {
      sys: { type: 'Link', linkType: 'ContentType', id: 'milestones' },
    },
    createdBy: { sys: { type: 'Link', linkType: 'User', id: 'user-id' } },
    updatedBy: { sys: { type: 'Link', linkType: 'User', id: 'user-id' } },
    revision: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  fields: {},
});

const milestoneEvents: MilestoneEvent[] = [
  'MilestonesPublished',
  'MilestonesUnpublished',
];

describe('OpenSearch Index Milestone Handler', () => {
  const handler = indexMilestoneOpensearchHandler();

  afterEach(() => jest.clearAllMocks());

  test.each(milestoneEvents)(
    'should reindex both project-aims and project-milestones on %s',
    async (eventType) => {
      const event = createEventBridgeEventMock(
        getMilestoneWebhookDetail('milestone-1'),
        eventType,
        'milestone-1',
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
      getMilestoneWebhookDetail('milestone-1'),
      'MilestonesPublished' as MilestoneEvent,
      'milestone-1',
    );

    await expect(handler(event)).rejects.toThrow('Reindex failed');
  });
});
