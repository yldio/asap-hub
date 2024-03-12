import { UserProfileRecentWorks } from '@asap-hub/react-components';
import { number, text } from './knobs';
import { UserProfileDecorator } from './user-profile';

export default {
  title: 'Organisms / User Profile / Recent Works',
  decorators: [UserProfileDecorator],
};

export const Normal = () => (
  <UserProfileRecentWorks
    orcid={text('ORCID', '0000-0002-9945-3696')}
    orcidWorks={Array.from({ length: number('Number of ORCID works', 2) }).map(
      (_, i) => {
        if (i === 0) {
          return {
            doi: text('Work DOI', 'https://doi.org/10.7554/elife.07083'),
            title: text(
              'Work Title',
              'Recognizing the importance of new tools and resources for research',
            ),
            type: 'WEBSITE',
            publicationDate: {
              year: '2015',
              month: '3',
            },
            lastModifiedDate: '1478865224685',
          };
        }
        return {
          title:
            'Systems genetics analysis identifies calcium-signaling defects as novel cause of congenital heart disease.',
          type: 'JOURNAL_ARTICLE',
          publicationDate: {
            year: '2020',
            month: '08',
            day: '28',
          },
          lastModifiedDate: '1600246394769',
        };
      },
    )}
  />
);
