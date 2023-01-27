import { css } from '@emotion/react';
import { steel, mint, tin, neutral900 } from '../colors';
import { crossSmallIcon } from '../icons';
import { perRem } from '../pixels';
import Ellipsis from './Ellipsis';

const borderWidth = 1;
const containerStyles = css({
  display: 'flex',
  cursor: 'default',
  justifyContent: 'center',
  alignItems: 'center',
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

const iconStyles = css({
  display: 'flex',
  marginLeft: `${8 / perRem}em`,
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
  svg: {
    fill: neutral900.rgba,
  },
  cursor: 'pointer',
});

type TagProps = {
  readonly enabled?: boolean;
  readonly highlight?: boolean;
  readonly children?: React.ReactNode;
  readonly title?: string;
  onRemove?: () => void;
};

const Tag: React.FC<TagProps> = ({
  children,
  highlight = false,
  enabled = true,
  onRemove,
  title,
}) => (
  <div css={containerStyles} title={title}>
    <div
      css={[styles, highlight && highlightStyles, !enabled && disabledStyles]}
    >
      <Ellipsis>{children}</Ellipsis>
      {onRemove && (
        <button css={iconStyles} onClick={onRemove}>
          {crossSmallIcon}
        </button>
      )}
    </div>
  </div>
);

export default Tag;
