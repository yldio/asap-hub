import React from 'react';

import { Card, Headline2, Paragraph } from '../atoms';
import { TagList } from '../molecules';

type ProfileSkillsProps = {
  readonly skills: string[];
  readonly skillsDescription?: string;
};

const ProfileSkills: React.FC<ProfileSkillsProps> = ({
  skills = [],
  skillsDescription,
}) => (
  <Card>
    <Headline2 styleAsHeading={3}>Expertise and Resources</Headline2>
    {skillsDescription ? <Paragraph>{skillsDescription}</Paragraph> : null}
    <TagList tags={skills} />
  </Card>
);

export default ProfileSkills;
