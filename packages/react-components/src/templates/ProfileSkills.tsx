import React from 'react';
import css from '@emotion/css';
import { Tag, Card, Headline2 } from '../atoms';

type SkillsProps = {
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

const Skills: React.FC<SkillsProps> = ({ skills = [] }) => {
  return (
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
  );
};

export default Skills;
