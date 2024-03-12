import { ComponentProps } from 'react';
import { UserProfileAbout } from '@asap-hub/react-components';

import { text } from './knobs';

export default {
  title: 'Templates / User Profile / About',
  component: UserProfileAbout,
  decorators: [],
};

const props = (): ComponentProps<typeof UserProfileAbout> => ({
  biography: text(
    'Biography',
    'Dr. Randy Schekman is a Professor in the Department of Molecular and Cell Biology, University of California, and an Investigator of the Howard Hughes Medical Institute. He studied the enzymology of DNA replication as a graduate student with Arthur Kornberg at Stanford University. Among his awards is the Nobel Prize in Physiology or Medicine, which he shared with James Rothman and Thomas Südhof.',
  ),
  biosketch: text('Biosketch', 'http://google.com'),
  orcidWorks: [
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
  ],
});

export const ViewOnly = () => <UserProfileAbout {...props()} />;
export const Editable = () => (
  <UserProfileAbout {...props()} editBiographyHref="/wrong" />
);
