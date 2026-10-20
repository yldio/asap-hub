import { SubscribeToCalendarsPage } from '@asap-hub/react-components';

export default {
  title: 'Templates / Events / Subscribe To Calendars Page',
  component: SubscribeToCalendarsPage,
};

export const Normal = () => (
  <SubscribeToCalendarsPage
    hubCalendars={[
      { color: '#B1365F', id: 'hub@asap.science', name: 'ASAP Hub' },
    ]}
    interestGroupCalendars={[
      { color: '#5C1158', id: 'ig-1', name: 'LRRK2 Central Webinar' },
      { color: '#711616', id: 'ig-2', name: 'Mito911 Webinar Series' },
      { color: '#691426', id: 'ig-3', name: 'Sci 3: PD Pathogenic Pathways' },
      { color: '#BE6D00', id: 'ig-4', name: 'Sci 4: PD Pathogenic Pathways' },
    ]}
    workingGroupCalendars={[
      { color: '#B1440E', id: 'wg-1', name: '10X Genomics Steering Committee' },
      { color: '#853104', id: 'wg-2', name: 'Spatial Transcriptomics WG' },
      { color: '#8C500B', id: 'wg-3', name: 'Town Hall Meetings' },
      { color: '#754916', id: 'wg-4', name: 'Trainee Network' },
      { color: '#88880E', id: 'wg-5', name: 'Complex Disease Network' },
      { color: '#AB8B00', id: 'wg-6', name: 'PD GWAS Working Group' },
    ]}
    seminarSeriesCalendars={[
      {
        color: '#856508',
        id: 'seminar-1',
        name: 'Seminar Series: Genetics and Ancestry',
      },
      {
        color: '#28754E',
        id: 'seminar-2',
        name: 'Seminar Series: Data Sharing in Practice',
      },
      {
        color: '#1B887A',
        id: 'seminar-3',
        name: 'Seminar Series: Early-Career Showcase',
      },
    ]}
  />
);
