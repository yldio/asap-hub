import * as contentful from 'contentful-management';

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

const client = contentful.createClient({
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

    // Build the editor layout
    const editorLayout: any[] = [];

    // Add the resource fields group
    editorLayout.push({
      groupId: RESOURCE_GROUP_ID,
      name: RESOURCE_GROUP_NAME,
      items: RESOURCE_FIELD_IDS.map((fieldId) => ({ fieldId })),
    });

    // Add remaining fields to a default group
    const remainingFieldIds = allFieldIds.filter(
      (fieldId) => !RESOURCE_FIELD_IDS.includes(fieldId),
    );

    if (remainingFieldIds.length > 0) {
      editorLayout.push({
        groupId: 'default',
        name: 'General',
        items: remainingFieldIds.map((fieldId) => ({ fieldId })),
      });
      console.log(
        `   Added ${remainingFieldIds.length} other fields to "General" group`,
      );
    }

    // Update the editor interface
    editorInterface.editorLayout = editorLayout;

    // groupControls is required when editorLayout is present
    // Top level groups MUST use widgetId: 'topLevelTab'
    editorInterface.groupControls = [
      {
        groupId: RESOURCE_GROUP_ID,
        widgetId: 'topLevelTab',
        widgetNamespace: 'builtin',
      },
      {
        groupId: 'default',
        widgetId: 'topLevelTab',
        widgetNamespace: 'builtin',
      },
    ];

    console.log('\n💾 Saving editor interface...');
    await editorInterface.update();

    // Re-publish content type to force UI refresh (workaround for Contentful bug)
    console.log('\n🔄 Re-publishing content type to refresh UI...');
    const publishedContentType = await contentType.publish();
    console.log(`   Content type version: ${publishedContentType.sys.version}`);

    console.log('\n✅ Field groups successfully configured!');
    console.log(
      `   Resource fields (${RESOURCE_FIELD_IDS.length}) are now in "${RESOURCE_GROUP_NAME}" tab`,
    );
    console.log(
      `   Other fields (${remainingFieldIds.length}) are in "General" tab`,
    );
    console.log(
      '\n🎉 Done! Check your Contentful web app to see the new tabs.',
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
