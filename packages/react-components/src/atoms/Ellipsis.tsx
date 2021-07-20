import { css } from '@emotion/react';

export const ellipsisStyles = css({
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const Ellipsis: React.FC = ({ children }) => (
  <span css={ellipsisStyles}>{children}</span>
);

export default Ellipsis;
