import { ResearchOutputRelatedEventsCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / Research Output Related Events Card',
};

export const Normal = () => (
  <ResearchOutputRelatedEventsCard
    getRelatedEventSuggestions={() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              label: 'Event 1',
              value: '1',
              endDate: new Date().toISOString(),
            },
            {
              label: 'Event 2',
              value: '2',
              endDate: new Date().toISOString(),
            },
            {
              label: 'Event 3',
              value: '3',
              endDate: new Date().toISOString(),
            },
          ]);
        }, 1000);
      })
    }
    isSaving={false}
    relatedEvents={[]}
  />
);
