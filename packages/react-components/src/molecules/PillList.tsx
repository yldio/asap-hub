import { css } from '@emotion/react';
import React from 'react';

import { Pill } from '../atoms';
import { rem } from '../pixels';

const ROW_GAP_OFFSET = 12;
const listStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  columnGap: rem(12),

  listStyle: 'none',
  margin: 0,
  marginTop: rem(ROW_GAP_OFFSET),
  padding: 0,

  textTransform: 'capitalize',
});
const listItemStyles = css({
  marginTop: `-${rem(ROW_GAP_OFFSET)}`,
});

interface PillListProps {
  readonly pills: ReadonlyArray<string>;
  small?: boolean;
}
const PillList: React.FC<PillListProps> = ({ pills, small = true }) => (
  <ul css={listStyles}>
    {pills.map((pill, i) => (
      <li key={`pill-${i}`} css={listItemStyles}>
        <Pill small={small}>{pill}</Pill>
      </li>
    ))}
  </ul>
);

export default PillList;
