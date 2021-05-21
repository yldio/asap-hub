import { css } from '@emotion/react';
import { steel, mint, tin } from '../colors';
import { perRem } from '../pixels';

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
  padding: `${5 / perRem}em ${15 / perRem}em ${5 / perRem}em`,

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

const disabledStyles = css({
  borderColor: tin.rgb,
  color: tin.rgb,
});

type TagProps = {
  readonly enabled?: boolean;
  readonly highlight?: boolean;
  readonly children?: React.ReactNode;
};

const Tag: React.FC<TagProps> = ({
  children,
  highlight = false,
  enabled = true,
}) => (
  <div css={containerStyles}>
    <div
      css={[styles, highlight && highlightStyles, !enabled && disabledStyles]}
    >
      {children}
    </div>
  </div>
);

export default Tag;
