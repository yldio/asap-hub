export type WebhookDetailType =
  | 'ExternalAuthorsPublished'
  | 'ExternalAuthorsCreated'
  | 'ExternalAuthorsUpdated'
  | 'ExternalAuthorsUnpublished'
  | 'ExternalAuthorsDeleted'
  | 'LabsCreated'
  | 'LabsDeleted'
  | 'LabsPublished'
  | 'LabsUnpublished'
  | 'LabsUpdated'
  | 'LabsUpdated'
  | 'NewsPublished'
  | 'ResearchOutputsCreated'
  | 'ResearchOutputsDeleted'
  | 'ResearchOutputsPublished'
  | 'ResearchOutputsUnpublished'
  | 'ResearchOutputsUpdated'
  | 'TeamsCreated'
  | 'TeamsDeleted'
  | 'TeamsPublished'
  | 'TeamsUnpublished'
  | 'TeamsUpdated'
  | 'UsersCreated'
  | 'UsersDeleted'
  | 'UsersPublished'
  | 'UsersUnpublished'
  | 'UsersUpdated';

export type WebhookDetail<T extends object = object> = {
  resourceId: string;
} & T;
