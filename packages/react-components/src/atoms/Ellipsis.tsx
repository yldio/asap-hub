import { css } from '@emotion/react';

export const ellipsisStyles = css({
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

type EllipsisProps = {
  readonly children?: React.ReactNode;
};

const Ellipsis: React.FC<EllipsisProps> = ({ children }) => (
  <span css={ellipsisStyles}>{children}</span>
);

export default Ellipsis;
