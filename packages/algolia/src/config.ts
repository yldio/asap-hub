/* istanbul ignore file */

const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX } = process.env;

export const algoliaAppId = ALGOLIA_APP_ID || 'LVYWOPQ0A9';
export const algoliaApiKey = ALGOLIA_API_KEY || '';
export const algoliaIndex = ALGOLIA_INDEX || 'asap-hub_research_outputs_dev';
