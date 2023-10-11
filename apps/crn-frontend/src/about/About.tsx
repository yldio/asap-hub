import { FC } from 'react';
import { AboutPageBody } from '@asap-hub/react-components';
import { useDiscoverState } from './state';

const About: FC<Record<string, never>> = () => {
  const { members, scientificAdvisoryBoard, aboutUs, membersTeamId } =
    useDiscoverState();

  return (
    <AboutPageBody
      aboutUs={aboutUs}
      members={members}
      scientificAdvisoryBoard={scientificAdvisoryBoard}
      membersTeamId={membersTeamId}
    />
  );
};

export default About;
