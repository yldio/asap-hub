import React from 'react';

import { Card, Headline2 } from '../atoms';
import { TagList } from '../molecules';

type ProfileSkillsProps = {
  readonly skills: string[];
};

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ skills = [] }) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>Expertise and Resources</Headline2>
      <TagList tags={skills} />
    </Card>
  );
};

export default ProfileSkills;
