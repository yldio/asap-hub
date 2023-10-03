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

  // atm there is only 1 event with tags
  const outputs = (await outputDataProvider.fetch({ take: 20 })).items;

  console.log(outputs);

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
        mainEntityId: output.relatedEntity?.id!,
      });

      console.log(`output with id ${output.id} updated.`);
      outputsUpdated++;
    } catch (e) {
      console.log(e);
      console.log(`could not update event with id ${output.id}.`);
      outputsFailed++;
    }
  }

  console.log(`Outputs updated: ${outputsUpdated} failed ${outputsFailed}`);
};

app().catch(console.error);
