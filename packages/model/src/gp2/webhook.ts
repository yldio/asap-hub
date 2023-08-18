import type { EntityEventAction } from '../webhook';

export type OutputEvent = `Outputs${EntityEventAction}`;
export type ProjectEvent = `Projects${EntityEventAction}`;

export type WebhookDetailType = OutputEvent | ProjectEvent;
