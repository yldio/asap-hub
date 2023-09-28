import { css } from '@emotion/react';

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
  marginBottom: `${12 / perRem}em`,
  ':not(:nth-last-of-type(1))': {
    paddingRight: `${12 / perRem}em`,
  },
});

const centerListStyles = css({
  justifyContent: 'center',
  gap: `${15 / perRem}em`,
});

const centredItemStyles = css({
  marginBottom: 0,
  ':not(:nth-last-of-type(1))': {
    paddingRight: 0,
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

const overflowStyles = css({
  marginBottom: `${12 / perRem}em`,
});

const SAFARI_MAX_SAFE_INTEGER = 2 ** 31 - 2;
interface TagListProps {
  tags: ReadonlyArray<string | { tag: string; href: string }>;
  enabled?: boolean;
  min?: number;
  max?: number;
  centerContent?: boolean;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  min = SAFARI_MAX_SAFE_INTEGER,
  max = SAFARI_MAX_SAFE_INTEGER,
  enabled = true,
  centerContent = false,
}) =>
  tags.length ? (
    <ul
      css={[
        listStyles,
        { counterReset: `tags ${tags.length}` },
        centerContent && centerListStyles,
      ]}
    >
      {tags.map((tag, index) => (
        <li
          key={index}
          css={[
            normalListItemStyles,
            summarizedListItemStyles(min, max),
            centerContent && centredItemStyles,
          ]}
        >
          {typeof tag === 'string' ? (
            <Tag title={tag} enabled={enabled}>
              {tag}
            </Tag>
          ) : (
            <Tag title={tag.tag} href={tag.href} enabled={enabled}>
              {tag.tag}
            </Tag>
          )}
        </li>
      ))}
      <li key="overflow" className="overflow" css={overflowStyles}>
        <Tag enabled={enabled}>
          <span css={overflowContentStyles}></span>
        </Tag>
      </li>
    </ul>
  ) : null;

export default TagList;
