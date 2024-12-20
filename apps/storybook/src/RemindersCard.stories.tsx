import { RemindersCard } from '@asap-hub/react-components';
import type { ReminderEntity } from '@asap-hub/react-components';

import { boolean, number } from './knobs';

export default {
  title: 'Organisms / Reminders Card',
  component: RemindersCard,
};

const realRemindersExample = [
  {
    id: 'research-output-in-review-1ZTYcTgSkHKSTXsisOT5qt',
    entity: 'Research Output' as ReminderEntity,
    href: '/shared-research/1ZTYcTgSkHKSTXsisOT5qt',
    description:
      '**Cristian Gonzalez-Cabrera** on team **Vila** requested PMs to review a team Protocol output: Fiber Photometry on Noradrenergic/Dopaminergic Neurons (Open Field).',
  },
  {
    id: 'event-happening-today--1234',
    entity: 'Event' as ReminderEntity,
    href: '/shared-research/62QTNOWckxZeNSrEHA55c3',
    description:
      'Today there is the Chris Shoemaker mito911 Webinar event happening at 5.00 PM.',
  },
  {
    id: 'manuscript-reminder-1ZTYcTgSkHKSTXsisOT5qt',
    entity: 'Manuscript' as ReminderEntity,
    href: '/manuscripts/1ZTYcTgSkHKSTXsisOT5qt',
    description:
      '**John Doe** on **Team Alessi** replied to a quick check on the manuscript:',
    subtext: `RAB32 Ser71Arg in autosomal dominant Parkinson's disease: linkage, association, and functional analyses`,
    date: '2024-12-19T15:47:34.678Z',
  },
  {
    id: 'research-output-in-draft-1234',
    entity: 'Research Output' as ReminderEntity,
    href: '/shared-research/62QTNOWckxZeNSrEHA55c3',
    description:
      '**Jan Tonnesen** on team **Alessi** switched to draft a team Article output: A STED Microscope for Multimodal Investigation of Dendritic Spine Structure and Function.',
  },
];
export const Normal = () => (
  <RemindersCard
    reminders={realRemindersExample}
    limit={number('Limit', 3)}
    canPublish={boolean('User can publish', true)}
  />
);
