import { indexResearchOutputByTeamHandler } from '../../../src/handlers/teams/algolia-index-team-research-outputs-handler';
import { getResearchOutputResponse } from '../../fixtures/research-output.fixtures';
import { getTeamPublishedEvent } from '../../fixtures/teams.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { researchOutputControllerMock } from '../../mocks/research-output.controller.mock';

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
jest.mock('../../../src/utils/logger');

describe('Team Research Outputs Index', () => {
  const indexHandler = indexResearchOutputByTeamHandler(
    researchOutputControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should fetch every research output and create a record on Algolia', async () => {
    const items = [
      { ...getResearchOutputResponse(), id: 'research-outputs-1' },
      { ...getResearchOutputResponse(), id: 'research-outputs-2' },
      { ...getResearchOutputResponse(), id: 'research-outputs-3' },
    ];

    researchOutputControllerMock.fetch.mockResolvedValueOnce({
      total: 3,
      items,
    });

    const updateEvent = getTeamPublishedEvent('teamId');

    await indexHandler(updateEvent);

    expect(researchOutputControllerMock.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { teamId: updateEvent.detail.resourceId },
      }),
    );

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
      items.map((item) => ({
        data: item,
        type: 'research-output',
      })),
    );
  });

  test('Should not trigger algolia save when there are no research outputs associated with the team that has been updated', async () => {
    researchOutputControllerMock.fetch.mockResolvedValueOnce({
      total: 0,
      items: [],
    });

    const updateEvent = getTeamPublishedEvent('teamId');

    await indexHandler(updateEvent);

    expect(researchOutputControllerMock.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { teamId: updateEvent.detail.resourceId },
      }),
    );

    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
  });
});
