import * as contentful from 'contentful-management';

export const getWebhook = async (
  id: string,
  space: contentful.Space,
): Promise<contentful.WebHooks | undefined> => {
  try {
    return await space.getWebhook(`${id.toLowerCase()}-webhook`);
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
