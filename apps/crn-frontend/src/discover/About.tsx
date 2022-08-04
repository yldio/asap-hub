import { FC } from 'react';
import { DiscoverAbout } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const About: FC<Record<string, never>> = () => {
  const { members, scientificAdvisoryBoard, aboutUs } = useDiscoverState();

  return (
    <DiscoverAbout
      aboutUs={aboutUs}
      members={members}
      scientificAdvisoryBoard={scientificAdvisoryBoard}
    />
  );
};

export default About;
