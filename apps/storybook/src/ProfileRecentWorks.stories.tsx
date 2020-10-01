import React from 'react';
import { ProfileRecentWorks } from '@asap-hub/react-components';

export default {
  title: 'Templates / Profile / Recent Works',
};

export const Normal = () => (
  <ProfileRecentWorks
    orcidWorks={[
      {
        doi: 'https://doi.org/10.7554/elife.07083',
        title:
          'Recognizing the importance of new tools and resources for research',
        type: 'WEBSITE',
        publicationDate: {
          year: '2015',
          month: '3',
        },
        lastModifiedDate: '1478865224685',
      },
      {
        title:
          'Systems genetics analysis identifies calcium-signaling defects as novel cause of congenital heart disease.',
        type: 'JOURNAL_ARTICLE',
        publicationDate: {
          year: '2020',
          month: '08',
          day: '28',
        },
        lastModifiedDate: '1600246394769',
      },
    ]}
  />
);
