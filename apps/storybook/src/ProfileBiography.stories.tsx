import React from 'react';
import { text } from '@storybook/addon-knobs';
import { ProfileBiography } from '@asap-hub/react-components';

export default {
  title: 'Templates / Profile / Biography',
};

export const Biography = () => (
  <ProfileBiography
    biography={text(
      'Biography',
      'Dr. Randy Schekman is a Professor in the Department of Molecular and Cell Biology, University of California, and an Investigator of the Howard Hughes Medical Institute. He studied the enzymology of DNA replication as a graduate student with Arthur Kornberg at Stanford University. Among his awards is the Nobel Prize in Physiology or Medicine, which he shared with James Rothman and Thomas Südhof.',
    )}
  />
);
