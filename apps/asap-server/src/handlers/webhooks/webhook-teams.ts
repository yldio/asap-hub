import Boom from '@hapi/boom';
import algoliasearch, { SearchClient } from 'algoliasearch';
import { EventBridge } from 'aws-sdk';
import { framework as lambda } from '@asap-hub/services-common';
import { Team, WebhookPayload } from '@asap-hub/squidex';
import { ListResearchOutputResponse } from '@asap-hub/model';
import { http } from '../../utils/instrumented-framework';
import { Handler } from '../../utils/types';
import {
  eventBus,
  eventSource,
  algoliaAppId,
  algoliaIndexApiKey,
  algoliaResearchOutputIndex,
} from '../../config';
import validateRequest from '../../utils/validate-squidex-request';
import ResearchOutputs, {
  ResearchOutputController,
} from '../../controllers/research-outputs';

export const teamsWebhookFactory = (
  eventBridge: EventBridge,
  researchOutputController: ResearchOutputController,
  algoliaClient: SearchClient,
): Handler =>
  http(
    async (
      request: lambda.Request<WebhookPayload<Team>>,
    ): Promise<lambda.Response> => {
      validateRequest(request);

      const type = getEventType(request.payload.type);

      if (!type) {
        return {
          statusCode: 204,
        };
      }

      await eventBridge
        .putEvents({
          Entries: [
            {
              EventBusName: eventBus,
              Source: eventSource,
              DetailType: type,
              Detail: JSON.stringify(request.payload),
            },
          ],
        })
        .promise();

      await indexResearchOutputs(
        algoliaClient,
        await getTeamOutputsUpdate(
          request.payload.payload,
          researchOutputController,
        ),
      );

      return {
        statusCode: 200,
      };
    },
  );

export type TeamsEventType = 'TeamsCreated' | 'TeamsUpdated';

const getEventType = (customType: string): TeamsEventType | undefined => {
  if (customType === 'TeamsPublished') {
    return 'TeamsCreated';
  }

  if (customType === 'TeamsUpdated') {
    return 'TeamsUpdated';
  }

  return undefined;
};

const getTeamOutputsUpdate = async (
  response: WebhookPayload<Team>['payload'],
  researchOutputController: ResearchOutputController,
) => {
  const outputsIds = (response.dataOld?.outputs.iv ?? []).filter(
    (outputId) => !(response.data?.outputs.iv ?? []).includes(outputId),
  );

  if (outputsIds.length === 0) return [];

  try {
    const results = await researchOutputController.fetch({
      take: outputsIds.length,
      skip: 0,
      filter: outputsIds.map((outputId) => `contains(id/, '${outputId}')`),
    });

    return results.items;
  } catch (e) {
    throw Boom.badGateway();
  }
};

const indexResearchOutputs = async (
  algoliaClient: SearchClient,
  outputsData: ListResearchOutputResponse['items'],
) => {
  if (outputsData.length === 0) return;

  const algoliaIndex = algoliaClient.initIndex(algoliaResearchOutputIndex);

  try {
    await algoliaIndex.saveObjects(
      outputsData.map((researchOutput) => ({
        ...researchOutput,
        objectID: researchOutput.id,
      })),
      { autoGenerateObjectIDIfNotExist: true },
    );
  } catch (e) {
    throw Boom.badData();
  }
};

export const handler: Handler = teamsWebhookFactory(
  new EventBridge(),
  new ResearchOutputs(),
  algoliasearch(algoliaAppId, algoliaIndexApiKey),
);
