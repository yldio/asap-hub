import { FC } from 'react';
import { DiscoverAbout } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const About: FC<Record<string, never>> = () => {
  const { members, scientificAdvisoryBoard, aboutUs, membersTeamId } =
    useDiscoverState();

  return (
    <DiscoverAbout
      aboutUs={aboutUs}
      members={members}
      scientificAdvisoryBoard={scientificAdvisoryBoard}
      membersTeamId={membersTeamId}
    />
  );
};

export default About;
