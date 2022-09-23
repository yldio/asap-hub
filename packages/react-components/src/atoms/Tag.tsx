import { css } from '@emotion/react';
import { steel, mint, tin, apricot, clay } from '../colors';
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

const inactiveStyles = css({
  backgroundColor: apricot.rgb,
  color: clay.rgb,
  border: 'transparent',
});

type TagProps = {
  readonly enabled?: boolean;
  readonly highlight?: boolean;
  readonly children?: React.ReactNode;
  readonly inactive?: boolean;
};

const Tag: React.FC<TagProps> = ({
  children,
  highlight = false,
  enabled = true,
  inactive = false,
}) => (
  <div css={containerStyles}>
    <div
      css={[
        styles,
        highlight && highlightStyles,
        !enabled && disabledStyles,
        inactive && inactiveStyles,
      ]}
    >
      <Ellipsis>{children}</Ellipsis>
    </div>
  </div>
);

export default Tag;
