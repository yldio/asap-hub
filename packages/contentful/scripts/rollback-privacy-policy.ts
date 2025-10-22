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
  'fields.path': '/privacy-notice',
  'sys.archivedAt[exists]': false,
  limit: 1,
};

function transformRichText(richText: any): any {
  if (!richText || !richText.nodeType) {
    return richText;
  }

  const textString = JSON.stringify(richText);
  const updatedTextString = textString.replace(/notice/gi, (match: string) => {
    return match.toLowerCase() === match ? 'policy' : 'Policy';
  });
  return JSON.parse(updatedTextString);
}

const rollbackPrivacyPolicy = async () => {
  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);

  console.log('Looking for privacy notice page...');

  const entries = await environment.getEntries(queryOptions);

  if (entries.items.length === 0) {
    console.log('No privacy notice page found with path /privacy-notice');
    return;
  }

  const privacyNoticeEntry = entries.items[0];
  console.log(`Found privacy notice page: ${privacyNoticeEntry.sys.id}`);

  try {
    // Get the current entry to update
    const entry = await environment.getEntry(privacyNoticeEntry.sys.id);

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

    // Update the fields back to original values
    const updatedFields: any = {
      ...entry.fields,
      path: {
        'en-US': '/privacy-policy',
      },
      title: {
        'en-US': 'Privacy Policy',
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
    console.log('Successfully published the rolled back privacy policy page!');
  } catch (error) {
    console.error('Error rolling back privacy policy:', error);
  }
};

rollbackPrivacyPolicy().catch(console.error);
