import { text } from './knobs';
import { UserProfileBiography } from '@asap-hub/react-components';
import { UserProfileDecorator } from './user-profile';

export default {
  title: 'Organisms / User Profile / Biography',
  decorators: [UserProfileDecorator],
};

export const Normal = () => (
  <UserProfileBiography
    biography={text(
      'Biography',
      'Dr. Randy Schekman is a Professor in the Department of Molecular and Cell Biology, University of California, and an Investigator of the Howard Hughes Medical Institute. He studied the enzymology of DNA replication as a graduate student with Arthur Kornberg at Stanford University. Among his awards is the Nobel Prize in Physiology or Medicine, which he shared with James Rothman and Thomas Südhof.',
    )}
    biosketch={text('Biosketch', 'http://google.com')}
  />
);
