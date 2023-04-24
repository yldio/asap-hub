import * as contentful from 'contentful-management';

export const getWebhookId = (id: string) => `${id.toLowerCase()}-webhook`;

export const getWebhook = async (
  id: string,
  space: contentful.Space,
): Promise<contentful.WebHooks | undefined> => {
  try {
    const webhookId = getWebhookId(id);
    return await space.getWebhook(webhookId);
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
