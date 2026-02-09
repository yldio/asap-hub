import { createClient } from 'contentful-management';
import type { FieldGroupItem, GroupControl } from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const CONTENT_TYPE_ID = 'teams';
const RESOURCE_GROUP_ID = 'resourceGroup';
const RESOURCE_GROUP_NAME = 'Resource Section';

const RESOURCE_FIELD_IDS = [
  'resourceTitle',
  'resourceDescription',
  'resourceButtonCopy',
  'resourceContactEmail',
  'resourceLink',
];

const client = createClient({
  accessToken: contentfulManagementAccessToken,
});

async function setupFieldGroups() {
  try {
    console.log('🚀 Starting field group setup for teams content type...');
    console.log(`   Space ID: ${spaceId}`);
    console.log(`   Environment: ${environmentId}`);

    // Get space and environment
    const space = await client.getSpace(spaceId);
    const environment = await space.getEnvironment(environmentId);

    // Get the current editor interface
    console.log('\n📖 Fetching current editor interface...');
    const editorInterface =
      await environment.getEditorInterfaceForContentType(CONTENT_TYPE_ID);

    // Get all field IDs from the content type
    const contentType = await environment.getContentType(CONTENT_TYPE_ID);
    const allFieldIds = contentType.fields.map((field) => field.id);

    console.log(`   Found ${allFieldIds.length} fields in content type`);

    // Create the editor layout with field groups
    console.log(`\n✨ Creating field group: "${RESOURCE_GROUP_NAME}"`);

    // Get remaining fields (not in resource group)
    const remainingFieldIds = allFieldIds.filter(
      (fieldId) => !RESOURCE_FIELD_IDS.includes(fieldId),
    );

    // Build the editor layout with a single top-level tab containing a fieldset
    // Structure: One tab with regular fields + a collapsible fieldset for resource fields
    const editorLayout: FieldGroupItem[] = [
      {
        groupId: 'content',
        name: 'Content',
        items: [
          // Regular fields first
          ...remainingFieldIds.map((fieldId) => ({ fieldId })),
          // Resource fields as a nested fieldset group
          {
            groupId: RESOURCE_GROUP_ID,
            name: RESOURCE_GROUP_NAME,
            items: RESOURCE_FIELD_IDS.map((fieldId) => ({ fieldId })),
          },
        ],
      },
    ];

    console.log(
      `   ${remainingFieldIds.length} regular fields + "${RESOURCE_GROUP_NAME}" fieldset`,
    );

    // Update the editor interface
    editorInterface.editorLayout = editorLayout;

    // groupControls defines how each group is rendered
    // - Top level: topLevelTab
    // - Nested groups: fieldset (collapsible section)
    const groupControls: GroupControl[] = [
      {
        groupId: 'content',
        widgetId: 'topLevelTab',
        widgetNamespace: 'builtin',
      },
      {
        groupId: RESOURCE_GROUP_ID,
        widgetId: 'fieldset',
        widgetNamespace: 'builtin',
      },
    ];

    editorInterface.groupControls = groupControls;

    console.log('\n💾 Saving editor interface...');
    await editorInterface.update();

    // Re-publish content type to force UI refresh (workaround for Contentful bug)
    console.log('\n🔄 Re-publishing content type to refresh UI...');
    const publishedContentType = await contentType.publish();
    console.log(`   Content type version: ${publishedContentType.sys.version}`);

    console.log('\n✅ Field groups successfully configured!');
    console.log(
      `   Resource fields (${RESOURCE_FIELD_IDS.length}) are now in "${RESOURCE_GROUP_NAME}" fieldset`,
    );
    console.log(
      '\n🎉 Done! Check your Contentful web app to see the collapsible fieldset.',
    );
  } catch (error) {
    console.error('\n❌ Error setting up field groups:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  }
}

setupFieldGroups();
