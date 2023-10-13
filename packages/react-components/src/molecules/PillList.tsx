import { css } from '@emotion/react';
import React from 'react';

import { Pill } from '../atoms';
import { perRem } from '../pixels';

const ROW_GAP_OFFSET = 12;
const listStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  columnGap: `${12 / perRem}em`,

  listStyle: 'none',
  margin: 0,
  marginTop: `${ROW_GAP_OFFSET / perRem}em`,
  padding: 0,

  textTransform: 'capitalize',
});
const listItemStyles = css({
  marginTop: `-${ROW_GAP_OFFSET / perRem}em`,
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
