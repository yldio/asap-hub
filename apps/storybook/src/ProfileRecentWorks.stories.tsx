import React from 'react';
import { ProfileRecentWorks } from '@asap-hub/react-components';

export default {
  title: 'Templates / Profile / Recent Works',
};

export const Normal = () => (
  <ProfileRecentWorks
    orcidWorks={[
      {
        id: '42',
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
    ]}
  />
);
