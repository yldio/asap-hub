import React from 'react';
import css from '@emotion/css';

import { Tag, Card, Headline2 } from '../atoms';
import { perRem } from '../pixels';

type ProfileSkillsProps = {
  readonly skills: string[];
};

const listStyles = css({
  padding: 0,
  listStyle: 'none',

  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',

  '> li:not(:last-of-type)': {
    paddingRight: `${12 / perRem}em`,
  },
});

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ skills = [] }) => {
  return (
    <Card>
      <Headline2 styleAsHeading={3}>Expertise and Resources</Headline2>
      <ul css={listStyles}>
        {skills.map((skill, index) => (
          <li key={index}>
            <Tag>{skill}</Tag>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default ProfileSkills;
