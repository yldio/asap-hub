import { CalendarEvent, UserEvent } from '@asap-hub/model';
import { SquidexWebhookPayload, User, gp2, Calendar } from '@asap-hub/squidex';

export type SquidexEntityEvent =
  | 'Created'
  | 'Published'
  | 'Updated'
  | 'Unpublished'
  | 'Deleted';

export type UserPayload = SquidexWebhookPayload<User | gp2.User, UserEvent>;

export type CalendarPayload = SquidexWebhookPayload<Calendar, CalendarEvent>;
