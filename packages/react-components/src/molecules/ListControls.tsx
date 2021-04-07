import React from 'react';
import { NavHashLink } from 'react-router-hash-link';
import css from '@emotion/css';

import { charcoal, fern, lead } from '../colors';
import { perRem, lineHeight } from '../pixels';
import { detailViewIcon, listViewIcon } from '../icons';

const activeClassName = 'active-link';

const containerStyles = css({
  display: 'grid',
  gridAutoFlow: 'column',
  columnGap: '24px',
});

const styles = css({
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
  readonly listView: boolean;
  readonly listViewHref: string;
  readonly detailsViewHref: string;
}
const ListControls: React.FC<ListControlsProps> = ({
  listView,
  listViewHref,
  detailsViewHref,
}) => (
  <div css={containerStyles}>
    <NavHashLink
      to={detailsViewHref}
      activeClassName={activeClassName}
      css={[styles, { [`&.${activeClassName}`]: activeStyles }]}
      smooth
      isActive={() => !listView}
    >
      <p css={textStyles}>
        <span css={iconStyles}>{detailViewIcon}</span>
        Details View
      </p>
    </NavHashLink>
    <NavHashLink
      to={listViewHref}
      activeClassName={activeClassName}
      css={[styles, { [`&.${activeClassName}`]: activeStyles }]}
      smooth
      isActive={() => listView}
    >
      <p css={textStyles}>
        <span css={iconStyles}>{listViewIcon}</span>
        List View
      </p>
    </NavHashLink>
  </div>
);

export default ListControls;
