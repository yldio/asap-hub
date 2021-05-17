import React, { useContext } from 'react';
import { UserProfileContext } from '@asap-hub/react-context';

import { Card, Headline2, Paragraph } from '../atoms';
import { TagList } from '../molecules';
import UserProfilePlaceholderCard from './UserProfilePlaceholderCard';

type ProfileSkillsProps = {
  readonly skills: string[];
  readonly skillsDescription?: string;
};

const ProfileSkills: React.FC<ProfileSkillsProps> = ({
  skills = [],
  skillsDescription,
}) => {
  const { isOwnProfile } = useContext(UserProfileContext);
  return skills.length || isOwnProfile ? (
    <Card>
      <Headline2 styleAsHeading={3}>Expertise and Resources</Headline2>
      {!skillsDescription && isOwnProfile ? (
        <UserProfilePlaceholderCard title="How would you summarize your expertise and resources?">
          Add one or two sentences to help others understand your strengths
        </UserProfilePlaceholderCard>
      ) : (
        <Paragraph>{skillsDescription}</Paragraph>
      )}
      <TagList tags={skills} />
    </Card>
  ) : null;
};

export default ProfileSkills;
