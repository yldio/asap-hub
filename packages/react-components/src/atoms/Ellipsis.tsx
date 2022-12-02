import { css } from '@emotion/react';

export const ellipsisStyles = css({
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const lineClamp = (lines: number) =>
  css({
    WebkitLineClamp: lines,
  });

type EllipsisProps = {
  readonly children?: React.ReactNode;
  readonly numberOfLines?: number;
};

const Ellipsis: React.FC<EllipsisProps> = ({ children, numberOfLines }) => (
  <span css={[ellipsisStyles, numberOfLines && lineClamp(numberOfLines)]}>
    {children}
  </span>
);

export default Ellipsis;
