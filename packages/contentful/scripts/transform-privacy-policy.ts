import * as contentful from 'contentful-management';
import type { QueryOptions } from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

const queryOptions: QueryOptions = {
  content_type: 'pages',
  'fields.path': '/privacy-policy',
  'sys.archivedAt[exists]': false,
  limit: 1,
};

function transformRichText(richText: any): any {
  if (!richText || !richText.nodeType) {
    return richText;
  }

  const textString = JSON.stringify(richText);
  const updatedTextString = textString.replace(/policy/gi, (match: string) => {
    return match.toLowerCase() === match ? 'notice' : 'Notice';
  });
  return JSON.parse(updatedTextString);
}

const transformPrivacyPolicy = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  console.log('Looking for privacy policy page...');

  const entries = await environment.getEntries(queryOptions);

  if (entries.items.length === 0) {
    console.log('No privacy policy page found with path /privacy-policy');
    return;
  }

  const privacyPolicyEntry = entries.items[0];
  console.log(`Found privacy policy page: ${privacyPolicyEntry.sys.id}`);

  try {
    // Get the current entry to update
    const entry = await environment.getEntry(privacyPolicyEntry.sys.id);

    console.log('Current fields:');
    console.log(`  Path: ${entry.fields.path?.['en-US']}`);
    console.log(`  Title: ${entry.fields.title?.['en-US']}`);
    console.log(
      `  Text: ${
        entry.fields.text?.['en-US']
          ? 'Rich text content present'
          : 'No text content'
      }`,
    );

    // Update the fields
    const updatedFields: any = {
      ...entry.fields,
      path: {
        'en-US': '/privacy-notice',
      },
      title: {
        'en-US': 'Privacy Notice',
      },
    };

    // Transform the text field if it exists
    if (entry.fields.text?.['en-US']) {
      updatedFields.text = {
        'en-US': transformRichText(entry.fields.text['en-US']),
      };
    }

    // Update the entry
    entry.fields = updatedFields;
    const updatedEntry = await entry.update();

    console.log('Updated fields:');
    console.log(`  Path: ${updatedEntry.fields.path?.['en-US']}`);
    console.log(`  Title: ${updatedEntry.fields.title?.['en-US']}`);
    console.log(
      `  Text: ${
        updatedEntry.fields.text?.['en-US']
          ? 'Rich text content updated'
          : 'No text content'
      }`,
    );

    // Publish the updated entry
    await updatedEntry.publish();
    console.log('Successfully published the updated privacy policy page!');
  } catch (error) {
    console.error('Error transforming privacy policy:', error);
  }
};

transformPrivacyPolicy().catch(console.error);
