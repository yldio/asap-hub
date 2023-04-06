import * as contentful from 'contentful-management';

const contentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT!;

export const getWebhook = async (
  space: contentful.Space,
): Promise<contentful.WebHooks | undefined> => {
  try {
    return await space.getWebhook(
      `${contentfulEnvironment.toLowerCase()}-webhook`,
    );
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }

    const messageJson = JSON.parse(error.message);

    if (!('status' in messageJson) || messageJson.status !== 404) {
      throw error;
    }
  }

  return undefined;
};
