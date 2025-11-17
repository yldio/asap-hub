import * as contentful from 'contentful-management';
import fs from 'fs/promises';
import csvParse from 'csv-parse';
import { resolve } from 'path';
import { createLink, updateEntryFields } from '../src/utils/parse-fields';
import { Entry, Environment } from 'contentful-management';
import { RateLimiter } from 'limiter';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});
const rateLimiter = new RateLimiter({ tokensPerInterval: 10, interval: 5000 });

const NEW_CATEGORIES = [
  'Circuitry & Neuromodulation',
  'Gut & Microbiome',
  'Clearance',
  'Proteinopathy',
  'PD Risk Factors',
  'Omics',
  'Translational and Clinical Measures of Disease Biology',
  'Cellular Subtyping',
];

const RELEGATED_IMPACTS = [
  'New mechanism linked to previously established PD target/pathway',
  'General Discovery',
];
const RELEGATED_CATEGORIES = [
  'Circuit Physiology & Function',
  'Neuromodulator/transmitter Signaling',
  'Gut/Brain, Microbiome & Biomarkers',
  'Mitochondrial Pathways',
  'Endolysosomal Pathways',
  'SNCA',
  'Aging & Progression',
  'GWAS Functional Validation',
];

const normalizeTitle = (title: string) => title.trim().toLowerCase();

async function getEntriesByField(
  environment: Environment,
  contentType: string,
  fieldName: string,
  entryNames: string[],
) {
  const results = await Promise.all(
    entryNames.map((name) =>
      environment.getEntries({
        content_type: contentType,
        [`fields.${fieldName}`]: name,
      }),
    ),
  );

  return results.flatMap((r) => r.items);
}

const createNewImpactAndCategories = async (environment: Environment) => {
  console.log(`Update General Discovery impact name to Foundational Biology`);

  const existingImpactEntry = await environment.getEntries({
    content_type: 'impact',
    'fields.name': 'General Discovery',
  });

  const updatedImpactEntry = await updateEntryFields(
    existingImpactEntry.items[0],
    {
      name: 'Foundational Biology',
    },
  ).update();
  await updatedImpactEntry.publish();

  console.log(`General Discovery impact renamed to Foundational Biology`);

  for (const category of NEW_CATEGORIES) {
    console.log(`Creating new category ${category}`);

    await rateLimiter.removeTokens(1);
    const newCategory = await environment.createEntry('category', {
      fields: {
        name: {
          'en-US': category,
        },
      },
    });
    await newCategory.publish();
    console.log(`New Category ${category} created and published`);
  }
};

const fetchImpactsAndCategories = async (environment: Environment) => {
  const [impacts, categories] = await Promise.all([
    environment.getEntries({ content_type: 'impact' }),
    environment.getEntries({ content_type: 'category' }),
  ]);
  return [impacts.items, categories.items] as [Entry[], Entry[]];
};

/**
 * all manuscripts are valid to update
 * for research outputs, all articles are ok to update
 * only update datasets that already have an impact linked.
 * this is because the same title in the spreadsheet can link to a manuscript and different research output types. for research outputs we only really care about articles since impact and categories are required on those but there are some datasets linked to impacts we will be deleting so for datasets we only want to update those
 *
 */
const isValidEntryToUpdate = (entry: Entry) => {
  const entryType = entry.sys.contentType?.sys?.id;
  const docType = entry.fields?.documentType?.['en-US'];
  const impactId = entry.fields?.impact?.['en-US']?.sys?.id;

  const isManuscript = entryType === 'manuscripts';

  const isArticleResearchOutput =
    entryType === 'researchOutputs' && docType === 'Article';

  const isDatasetOutputWithImpact =
    entryType === 'researchOutputs' &&
    docType === 'Dataset' &&
    Boolean(impactId);

  return isManuscript || isArticleResearchOutput || isDatasetOutputWithImpact;
};

const updateAssociatedEntries = async (
  environment: Environment,
  impacts: Entry[],
  categories: Entry[],
  record: string[],
) => {
  const [title, newImpactName, newCategoriesStr] = record.map((s) => s.trim());
  const newCategoryNames = newCategoriesStr.split(',').map((s) => s.trim());

  const newImpactId = impacts.find(
    (impact) => impact.fields.name['en-US'] === newImpactName,
  )?.sys.id;
  const newCategoryIds = newCategoryNames
    .map(
      (name) => categories.find((c) => c.fields.name['en-US'] === name)?.sys.id,
    )
    .filter((id): id is string => !!id);

  if (!newImpactId || newCategoryIds.length === 0) {
    console.log(`Skipping "${title}": Impact or category not found`);
    return;
  }

  // trimming extra spaces and also limiting the query to the first 25 words. some of the titles are large and break when you do a search with them
  const cleanTitle = title.trim().split(' ').slice(0, 25).join(' ');

  try {
    const [researchOutputEntries, manuscriptEntries] = await Promise.all([
      environment.getEntries({
        content_type: 'researchOutputs',
        'fields.title[match]': cleanTitle,
        'fields.documentType[in]': 'Article,Dataset',
      }),
      environment.getEntries({
        content_type: 'manuscripts',
        'fields.title[match]': cleanTitle,
      }),
    ]);

    const allEntries = [
      ...researchOutputEntries.items,
      ...manuscriptEntries.items,
    ]
      .filter(
        (entry) =>
          // normalizing the title because some in the sheet and cms have the same title but different casing
          entry.fields.title &&
          normalizeTitle(entry.fields.title['en-US']) === normalizeTitle(title),
      )
      .filter(isValidEntryToUpdate);

    for (const entry of allEntries) {
      try {
        await rateLimiter.removeTokens(1);

        const isPublishedEntry = entry.isPublished();
        const updatedFields = {
          impact: createLink(newImpactId),
          categories: newCategoryIds.map(createLink),
        };

        const updatedEntry = await updateEntryFields(
          entry,
          updatedFields,
        ).update();

        // if not a published entry we don't want to publish after updating
        isPublishedEntry && (await updatedEntry.publish());
        console.log(`Updated entry with id ${entry.sys.id}`);
      } catch (err) {
        console.log(`Error updating entry with id ${entry.sys.id}: ${err}`);
      }
    }
  } catch (e) {
    console.log(`Error fetching entries with title ${title}: ${e}`);
  }
};

async function migrateEntryImpactAndCategories(
  environment: Environment,
  impacts: Entry[],
  categories: Entry[],
) {
  const csvPath = resolve(__dirname, './impact_categories_data.csv');
  const content = await fs.readFile(csvPath, 'utf8');

  const parser = csvParse(content, { delimiter: ',', from_line: 2 });

  for await (const row of parser) {
    await updateAssociatedEntries(environment, impacts, categories, row);
  }
}

const deleteUnusedImpactAndCategories = async (environment: Environment) => {
  const impactEntries = await getEntriesByField(
    environment,
    'impact',
    'name',
    RELEGATED_IMPACTS,
  );
  const categoryEntries = await getEntriesByField(
    environment,
    'category',
    'name',
    RELEGATED_CATEGORIES,
  );

  const allEntries = [...impactEntries, ...categoryEntries];

  for (const entry of allEntries) {
    const entryName = entry.fields.name['en-US'];
    try {
      console.log(`Deleting entry ${entryName}`);

      await rateLimiter.removeTokens(1);
      await entry.unpublish();
      await environment.deleteEntry(entry.sys.id);

      console.log(`Entry ${entryName} deleted`);
    } catch (err) {
      console.log(`Failed to delete ${entryName}:`, err);
    }
  }
  console.log('Deleted relegated impacts and categories');
};

const migrate = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  await createNewImpactAndCategories(environment);

  const [impacts, categories] = await fetchImpactsAndCategories(environment);
  await migrateEntryImpactAndCategories(environment, impacts, categories);

  await deleteUnusedImpactAndCategories(environment);
};

migrate().catch(console.error);
