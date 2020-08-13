import React from 'react';
import css from '@emotion/css';
import { Tag, Card, Headline2 } from '../atoms';

type ProfileSkillsProps = {
  readonly skills: string[];
};

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
  );
};

export default ProfileSkills;
