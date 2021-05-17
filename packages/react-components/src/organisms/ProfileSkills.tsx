import React, { useContext } from 'react';
import { UserProfileContext } from '@asap-hub/react-context';

import { Card, Headline2, Paragraph } from '../atoms';
import { TagList } from '../molecules';
import UserProfilePlaceholderCard from './UserProfilePlaceholderCard';
import { perRem } from '../pixels';

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
      {skills.length ? (
        <TagList tags={skills} />
      ) : (
        <div css={{ marginTop: `${24 / perRem}em` }}>
          <UserProfilePlaceholderCard title="Add tags to your profile">
            Help other researchers find you by adding tags about your skills,
            techniques, resources, and tools. Completing this section will make
            you more likely to come up in search results.
            <TagList
              tags={[
                'Structural biology',
                'Autophagy',
                'Transcriptional regulation',
                'Electron Microscopy',
                'Multi-omics',
                'Long-read sequencing',
                'LRRK2',
                'Alpha-synuclein',
                'VPS35',
              ]}
              enabled={false}
            />
          </UserProfilePlaceholderCard>
        </div>
      )}
    </Card>
  ) : null;
};

export default ProfileSkills;
