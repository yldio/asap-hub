import { Link } from 'react-router-dom';
import { css } from '@emotion/react';

import { charcoal, fern, lead } from '../colors';
import { perRem, lineHeight } from '../pixels';
import { cardViewIcon, listViewIcon } from '../icons';

const containerStyles = css({
  display: 'grid',
  gridAutoFlow: 'column',
  columnGap: '24px',
  width: 'fit-content',
  margin: `${12 / perRem}em 0`,
});

const linkStyles = css({
  color: charcoal.rgb,
  textDecoration: 'none',
  outline: 'none',
});

const textStyles = css({
  margin: 0,
  display: 'flex',
  fontSize: `${18 / perRem}em`,
  svg: {
    stroke: lead.rgb,
  },
});
const iconStyles = css({
  display: 'inline-block',
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,
  paddingRight: `${14 / perRem}em`,
});

const activeStyles = css({
  fontWeight: 'bold',
  svg: {
    stroke: fern.rgb,
  },
});

interface ListControlsProps {
  readonly isListView: boolean;
  readonly listViewHref: string;
  readonly cardViewHref: string;
}
const ListControls: React.FC<ListControlsProps> = ({
  isListView,
  listViewHref,
  cardViewHref,
}) => (
  <div css={containerStyles}>
    <Link to={cardViewHref} css={linkStyles}>
      <p css={[textStyles, !isListView && activeStyles]}>
        <span css={iconStyles}>{cardViewIcon}</span>
        Card View
      </p>
    </Link>
    <Link to={listViewHref} css={linkStyles}>
      <p css={[textStyles, isListView && activeStyles]}>
        <span css={iconStyles}>{listViewIcon}</span>
        List View
      </p>
    </Link>
  </div>
);

export default ListControls;
