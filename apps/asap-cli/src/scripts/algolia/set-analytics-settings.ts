/* istanbul ignore file */
import fs from 'fs/promises';
import { getIndexSchema } from './set-settings';

export type SetAlgoliaAnalyticsSettings = {
  algoliaAppId: string;
  algoliaCiApiKey: string;
  indexName: string;
};

export const setAlgoliaAnalyticsSettings = async ({
  algoliaAppId,
  algoliaCiApiKey,
  indexName,
}: SetAlgoliaAnalyticsSettings): Promise<void> => {
  const { path, client, index, indexSchema } = await getIndexSchema({
    algoliaAppId,
    algoliaCiApiKey,
    indexName,
    appName: 'crn-analytics',
  });

  const replicas = [
    `${indexName}_team_desc`,

    `${indexName}_wg_current_leadership_asc`,
    `${indexName}_wg_current_leadership_desc`,
    `${indexName}_wg_previous_leadership_asc`,
    `${indexName}_wg_previous_leadership_desc`,
    `${indexName}_wg_current_membership_asc`,
    `${indexName}_wg_current_membership_desc`,
    `${indexName}_wg_previous_membership_asc`,
    `${indexName}_wg_previous_membership_desc`,

    `${indexName}_ig_current_leadership_asc`,
    `${indexName}_ig_current_leadership_desc`,
    `${indexName}_ig_previous_leadership_asc`,
    `${indexName}_ig_previous_leadership_desc`,
    `${indexName}_ig_current_membership_asc`,
    `${indexName}_ig_current_membership_desc`,
    `${indexName}_ig_previous_membership_asc`,
    `${indexName}_ig_previous_membership_desc`,

    `${indexName}_user_desc`,
    `${indexName}_user_asap_output_asc`,
    `${indexName}_user_asap_output_desc`,
    `${indexName}_user_asap_public_output_asc`,
    `${indexName}_user_asap_public_output_desc`,
    `${indexName}_user_ratio_asc`,
    `${indexName}_user_ratio_desc`,
    `${indexName}_user_role_asc`,
    `${indexName}_user_role_desc`,
    `${indexName}_user_team_asc`,
    `${indexName}_user_team_desc`,

    `${indexName}_team_article_asc`,
    `${indexName}_team_article_desc`,
    `${indexName}_team_bioinformatics_asc`,
    `${indexName}_team_bioinformatics_desc`,
    `${indexName}_team_dataset_asc`,
    `${indexName}_team_dataset_desc`,
    `${indexName}_team_lab_resource_asc`,
    `${indexName}_team_lab_resource_desc`,
    `${indexName}_team_protocol_asc`,
    `${indexName}_team_protocol_desc`,
  ];
  await index.setSettings({ ...indexSchema, replicas }).wait();

  replicas.forEach(async (replica) => {
    const replicaIndex = client.initIndex(replica);
    const replicaNameSuffix = replica.replace(`${indexName}_`, '');
    const replicaIndexSchemaRaw = await fs.readFile(
      `${path}/${replicaNameSuffix}-schema.json`,
      'utf8',
    );
    const replicaIndexSchema = JSON.parse(replicaIndexSchemaRaw);
    await replicaIndex.setSettings(replicaIndexSchema);
  });
};
