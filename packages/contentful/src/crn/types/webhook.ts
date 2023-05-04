export type ContentfulWebhookPayloadType =
  | 'teams'
  | 'news'
  | 'externalAuthors'
  | 'users';

export interface ContentfulWebhookPublishPayload<
  T extends ContentfulWebhookPayloadType = ContentfulWebhookPayloadType,
> {
  metadata: {
    tags: string[];
  };
  sys: {
    type: 'Entry';
    id: string;
    space: {
      sys: {
        type: 'Link';
        linkType: 'Space';
        id: string;
      };
    };
    environment: {
      sys: {
        id: string;
        type: 'Link';
        linkType: 'Environment';
      };
    };
    contentType: {
      sys: {
        type: 'Link';
        linkType: 'ContentType';
        id: T;
      };
    };
    createdBy: {
      sys: {
        type: 'Link';
        linkType: 'User';
        id: string;
      };
    };
    updatedBy: {
      sys: {
        type: 'Link';
        linkType: 'User';
        id: string;
      };
    };
    revision: number;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    [key: string]: {
      'en-US': unknown;
    };
  };
}

export interface ContentfulWebhookUnpublishPayload<
  T extends ContentfulWebhookPayloadType = ContentfulWebhookPayloadType,
> {
  sys: {
    type: 'DeletedEntry';
    id: string;
    space: {
      sys: {
        type: 'Link';
        linkType: 'Space';
        id: string;
      };
    };
    environment: {
      sys: {
        id: string;
        type: 'Link';
        linkType: 'Environment';
      };
    };
    contentType: {
      sys: {
        type: 'Link';
        linkType: 'ContentType';
        id: T;
      };
    };
    revision: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  };
}

export type ContentfulWebhookPayload<
  T extends ContentfulWebhookPayloadType = ContentfulWebhookPayloadType,
> = ContentfulWebhookPublishPayload<T> | ContentfulWebhookUnpublishPayload<T>;
