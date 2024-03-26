import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { WebhookDetail } from '@asap-hub/model';

export type InterestGroupPayload = WebhookDetail<
  ContentfulWebhookPayload<'interestGroups'>
>;

export type TeamPayload = WebhookDetail<ContentfulWebhookPayload<'teams'>>;

export type UserPayload = WebhookDetail<ContentfulWebhookPayload<'users'>>;

export type CalendarContentfulPayload = WebhookDetail<
  ContentfulWebhookPayload<'calendars'>
>;

export type CalendarPayload = CalendarContentfulPayload;

export type WorkingGroupPayload = WebhookDetail<
  ContentfulWebhookPayload<'workingGroups'>
>;

export type TutorialPayload = WebhookDetail<
  ContentfulWebhookPayload<'tutorials'>
>;

export type NewsPayload = WebhookDetail<ContentfulWebhookPayload<'news'>>;
