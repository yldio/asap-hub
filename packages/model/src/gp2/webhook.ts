import type { EntityEventAction } from '../webhook';

export type OutputEvent = `Outputs${EntityEventAction}`;

export type WebhookDetailType = OutputEvent;
