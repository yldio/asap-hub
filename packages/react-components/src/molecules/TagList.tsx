import React from 'react';
import css from '@emotion/css';

import { perRem, tabletScreen } from '../pixels';
import { Tag } from '../atoms';


const NUMBER_OF_TAGS = 6;
const listStyles = css({
  padding: 0,
  marginBlockStart: 0,
  listStyle: 'none',

  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',

  '> .overflow': {
    display: 'none', // can later be activated by previous list items
  },
});

const normalListItemStyles = css({
  ':not(:nth-last-of-type(1))': {
    paddingRight: `${12 / perRem}em`,
  },
});

const summarizedListItemStyles = css({
  counterIncrement: 'tags -1',
  [`:nth-of-type(n + ${NUMBER_OF_TAGS + 1})`]: {
    display: 'none',
    '~ .overflow': {
      display: 'unset',
    },
  },

  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    [`:nth-of-type(n + ${NUMBER_OF_TAGS})`]: {
      display: 'none',
      '~ .overflow': {
        display: 'unset',
      },
    },
  },
});

const overflowContentStyles = css({
  '::after': {
    content: '"+" counter(tags)',
  },
});

interface TagListProps {
  tags: string[];
  summarize?: boolean;
}
const TagList: React.FC<TagListProps> = ({ tags, summarize = false }) =>
  tags.length ? (
    <ul
      css={[listStyles, summarize && { counterReset: `tags ${tags.length}` }]}
    >
      {tags.map((tag, index) => (
        <li
          key={index}
          css={[normalListItemStyles, summarize && summarizedListItemStyles]}
        >
          <Tag>{tag}</Tag>
        </li>
      ))}
      {summarize && (
        <li key="overflow" className="overflow">
          <Tag>
            <span css={overflowContentStyles}></span>
          </Tag>
        </li>
      )}
    </ul>
  ) : null;

export default TagList;
