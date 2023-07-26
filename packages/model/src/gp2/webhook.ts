import type { EntityEventAction } from '../webhook';

export type OutputEvent = `Output${EntityEventAction}`;

export type WebhookDetailType = OutputEvent;
