import { EventBridgeEvent } from 'aws-lambda';
import { indexResearchOutputByTeamHandler } from '../../../src/handlers/teams/index-team-reasearch-outputs-handler';
import { TeamEvent, TeamPayload } from '../../../src/handlers/event-bus';
import { createEventBridgeEventMock } from '../../helpers/events';
import { getResearchOutputResponse } from '../../fixtures/research-output.fixtures';
import { researchOutputControllerMock } from '../../mocks/research-outputs-controller.mock';
import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';

describe('Team Research Outputs Index', () => {
  const indexHandler = indexResearchOutputByTeamHandler(
    researchOutputControllerMock,
    algoliaSearchClientMock,
  );

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => jest.clearAllMocks());

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('Should instantiate contentful data provider when feature flag is truthy', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';

    const {
      indexResearchOutputByTeamHandler,
    } = require('../../../src/handlers/teams/index-team-reasearch-outputs-handler');
    const {
      ExternalAuthorContentfulDataProvider,
    } = require('../../../src/data-providers/contentful/external-authors.data-provider');
    const {
      ExternalAuthorSquidexDataProvider,
    } = require('../../../src/data-providers/external-authors.data-provider');
    const { getGraphQLClient } = require('@asap-hub/contentful');

    jest.mock('@asap-hub/contentful');
    jest.mock(
      '../../../src/data-providers/contentful/external-authors.data-provider',
    );
    jest.mock('../../../src/data-providers/external-authors.data-provider');

    const updateEvent = getEvent();

    const indexHandler = indexResearchOutputByTeamHandler(
      researchOutputControllerMock,
      algoliaSearchClientMock,
    );

    await indexHandler(updateEvent);

    expect(getGraphQLClient).toHaveBeenCalled();
    expect(ExternalAuthorContentfulDataProvider).toHaveBeenCalled();
    expect(ExternalAuthorSquidexDataProvider).not.toHaveBeenCalled();
  });

  test('Should instantiate squidex data provider when feature flag is falsy', async () => {
    process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

    const updateEvent = getEvent();

    const {
      indexResearchOutputByTeamHandler,
    } = require('../../../src/handlers/teams/index-team-reasearch-outputs-handler');
    const {
      ExternalAuthorContentfulDataProvider,
    } = require('../../../src/data-providers/contentful/external-authors.data-provider');
    const {
      ExternalAuthorSquidexDataProvider,
    } = require('../../../src/data-providers/external-authors.data-provider');
    const { getGraphQLClient } = require('@asap-hub/contentful');

    jest.mock('@asap-hub/contentful');
    jest.mock(
      '../../../src/data-providers/contentful/external-authors.data-provider',
    );
    jest.mock('../../../src/data-providers/external-authors.data-provider');

    const indexHandler = indexResearchOutputByTeamHandler(
      researchOutputControllerMock,
      algoliaSearchClientMock,
    );

    await indexHandler(updateEvent);

    expect(getGraphQLClient).toHaveBeenCalled();
    expect(ExternalAuthorContentfulDataProvider).not.toHaveBeenCalled();
    expect(ExternalAuthorSquidexDataProvider).toHaveBeenCalled();
  });
  test('Should fetch every research output and create a record on Algolia', async () => {
    const outputs = [
      { ...getResearchOutputResponse(), id: 'research-outputs-1' },
      { ...getResearchOutputResponse(), id: 'research-outputs-2' },
      { ...getResearchOutputResponse(), id: 'research-outputs-3' },
    ];

    researchOutputControllerMock.fetchById.mockResolvedValueOnce(outputs[0]!);
    researchOutputControllerMock.fetchById.mockRejectedValue(new Error());
    researchOutputControllerMock.fetchById.mockResolvedValueOnce(outputs[2]!);

    const updateEvent = getEvent();

    updateEvent.detail.payload = {
      ...updateEvent.detail.payload,
      data: { outputs: { iv: outputs.slice(0, 2).map(({ id }) => id) } },
      dataOld: { outputs: { iv: [outputs[2]!.id] } },
    };

    await indexHandler(updateEvent);

    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: outputs[0],
      type: 'research-output',
    });
    expect(algoliaSearchClientMock.save).not.toHaveBeenCalledWith(outputs[1]);
    expect(algoliaSearchClientMock.save).toHaveBeenCalledWith({
      data: outputs[2],
      type: 'research-output',
    });
  });

  test('Should not trigger algolia save when there are no research outputs associated with the team', async () => {
    const updateEvent = getEvent();
    updateEvent.detail.payload = {
      ...updateEvent.detail.payload,
      data: {
        outputs: { iv: [] },
      },
      dataOld: {
        outputs: { iv: [] },
      },
    };

    await indexHandler(updateEvent);
    expect(algoliaSearchClientMock.save).not.toHaveBeenCalled();
  });
});

const getEvent = (): EventBridgeEvent<TeamEvent, TeamPayload> =>
  createEventBridgeEventMock(createTeamSquidexWebhookPayload, 'TeamsPublished');

const createTeamSquidexWebhookPayload: TeamPayload = {
  type: 'TeamsPublished',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Published',
    id: '0ecccf93-bd06-9821-90ea-783h7te652d',
    data: {
      outputs: {
        iv: [],
      },
    },
    dataOld: {
      outputs: {
        iv: [],
      },
    },
  },
};
