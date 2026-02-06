import * as contentful from 'contentful-management';

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const contentfulManagementAccessToken =
  process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;
const environmentId = process.env.CONTENTFUL_ENV_ID!;

const client = contentful.createClient({
  accessToken: contentfulManagementAccessToken,
});

async function checkEditorInterface() {
  console.log('Checking editor interface for teams...');
  console.log(`Environment: ${environmentId}`);

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment(environmentId);
  const editorInterface =
    await environment.getEditorInterfaceForContentType('teams');

  console.log('\n=== EDITOR LAYOUT ===');
  console.log(JSON.stringify(editorInterface.editorLayout, null, 2));

  console.log('\n=== GROUP CONTROLS ===');
  console.log(JSON.stringify(editorInterface.groupControls, null, 2));
}

checkEditorInterface();
