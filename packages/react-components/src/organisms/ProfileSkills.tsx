import React from 'react';
import css from '@emotion/css';
import { Tag, Card, Headline2 } from '../atoms';
import { contentSidePaddingWithNavigation } from '../pixels';

type ProfileSkillsProps = {
  readonly skills: string[];
};

const sectionStyles = css({
  padding: `17.5px ${contentSidePaddingWithNavigation(8)}`,
});

const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginLeft: '-8px',
  marginRight: '-8px',
});

const elementStyle = css({
  paddingLeft: '8px',
  paddingRight: '8px',
  flexShrink: 0,
});

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ skills = [] }) => {
  return (
<<<<<<< HEAD:packages/react-components/src/organisms/ProfileSkills.tsx
    <Card>
      <Headline2>Skills and Expertise</Headline2>
      <div css={containerStyles}>
        {skills.map((skill, index) => (
          <div key={index} css={elementStyle}>
            <Tag>{skill}</Tag>
          </div>
        ))}
      </div>
    </Card>
=======
    <section css={sectionStyles}>
      <Card>
        <Headline2>Skills and Expertise</Headline2>
        <div css={containerStyles}>
          {skills.map((s) => (
            <div css={elementStyle}>
              <Tag>{s}</Tag>
            </div>
          ))}
        </div>
      </Card>
    </section>
>>>>>>> 7f1baca... feat: create recent works component:packages/react-components/src/templates/ProfileSkills.tsx
  );
};

export default ProfileSkills;
