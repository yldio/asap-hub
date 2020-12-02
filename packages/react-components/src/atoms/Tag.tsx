import React from 'react';
import css from '@emotion/css';
import { steel, mint, charcoal } from '../colors';
import { perRem } from '../pixels';
import Link from './Link';

const borderWidth = 1;
const containerStyles = css({
  display: 'flex',
  cursor: 'default',
  justifyContent: 'center',
  alignItems: 'center',

  marginTop: `${12 / perRem}em`,
  marginBottom: `${6 / perRem}em`,
});

const styles = css({
  padding: `${7 / perRem}em ${15 / perRem}em ${5 / perRem}em`,

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: `${18 / perRem}em`,
});

const highlightStyles = css({
  backgroundColor: mint.rgb,
});

const hoverStyles = css({
  transition: '200ms',

  ':hover': {
    borderColor: charcoal.rgb,
  },
});

type TagProps = {
  readonly href?: string;
  readonly highlight?: boolean;
  readonly children?: React.ReactNode;
};

const Tag: React.FC<TagProps> = ({ children, highlight = false, href }) => {
  const tagComponent = (
    <div css={containerStyles}>
      <div css={[styles, highlight && highlightStyles, href && hoverStyles]}>
        {children}
      </div>
    </div>
  );
  return href ? (
    <Link href={href} theme={null}>
      {tagComponent}
    </Link>
  ) : (
    tagComponent
  );
};

export default Tag;
