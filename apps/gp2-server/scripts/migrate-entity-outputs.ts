import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';

import { OutputContentfulDataProvider } from '../src/data-providers/output.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependency';
import { isInternalUser } from '@asap-hub/validation';

console.log('Migrate related entities refs in outputs...');

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const outputDataProvider = new OutputContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);

const app = async () => {
  let outputsUpdated = 0;
  let outputsFailed = 0;
  const take = 10;
  const processOutputs = async (skip: number) => {
    const { total, items: outputs } = await outputDataProvider.fetch({
      take,
      skip,
    });

    console.log(`starting updating for ${contentfulEnvId}`);
    console.log(`updating ${outputs.length} outputs`);

    for (const output of outputs) {
      try {
        console.log(`about to update output: ${output.id}`);
        await outputDataProvider.update(output.id, {
          title: output.title,
          updatedBy: '6aJ2pbmi1NuAaxko0YBBcG',
          documentType: output.documentType,
          sharingStatus: output.sharingStatus,
          addedDate: output.addedDate,
          authors: output.authors.map((auth) =>
            isInternalUser(auth)
              ? { userId: auth.id }
              : { externalUserId: auth.id },
          ),
          workingGroupIds: output.workingGroups?.map(({ id }) => id),
          projectIds: output.projects?.map(({ id }) => id),
        });

        console.log(`output with id ${output.id} updated.`);
        outputsUpdated++;
      } catch (e) {
        console.log(e);
        console.log(`could not update event with id ${output.id}.`);
        outputsFailed++;
      }
    }
    const next = skip + take;
    if (next < total) {
      await processOutputs(next);
    }
  };
  await processOutputs(0);
  console.log(`Outputs updated: ${outputsUpdated} failed ${outputsFailed}`);
};

app().catch(console.error);
