import React from 'react';
import css from '@emotion/css';

import { perRem, tabletScreen } from '../pixels';
import { Tag } from '../atoms';

const listStyles = css({
  padding: 0,
  margin: 0,

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

const summarizedListItemStyles = (min: number, max: number) =>
  css({
    counterIncrement: 'tags -1',
    [`:nth-of-type(n + ${max + 1})`]: {
      display: 'none',
      '~ .overflow': {
        display: 'unset',
      },
    },

    [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
      [`:nth-of-type(n + ${min + 1})`]: {
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
  tags: ReadonlyArray<string>;
  min?: number;
  max?: number;
}
const TagList: React.FC<TagListProps> = ({
  tags,
  min = Number.MAX_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
}) =>
  tags.length ? (
    <ul css={[listStyles, { counterReset: `tags ${tags.length}` }]}>
      {tags.map((tag, index) => (
        <li
          key={index}
          css={[normalListItemStyles, summarizedListItemStyles(min, max)]}
        >
          <Tag>{tag}</Tag>
        </li>
      ))}
      <li key="overflow" className="overflow">
        <Tag>
          <span css={overflowContentStyles}></span>
        </Tag>
      </li>
    </ul>
  ) : null;

export default TagList;
