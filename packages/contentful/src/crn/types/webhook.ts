export type ContentfulWebhookPayloadType =
  | 'calendars'
  | 'events'
  | 'externalAuthors'
  | 'interestGroups'
  | 'labs'
  | 'news'
  | 'researchOutputs'
  | 'teams'
  | 'users'
  | 'workingGroups'
  | 'tutorials'
  | 'news';

type CapitalizeFirstLetter<S extends string> =
  S extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : S;

export type WebhookPayloadTypeFirstLetterCapitalized =
  CapitalizeFirstLetter<ContentfulWebhookPayloadType>;
