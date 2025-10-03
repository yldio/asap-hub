import { css } from '@emotion/react';

import { rem } from '../pixels';
import { chevronCircleLeftIcon, Link } from '..';

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  width: rem(24),
  height: rem(24),
  paddingRight: rem(15),
});

const containerStyles = css({
  alignSelf: 'flex-start',
  padding: `${rem(30)} 0 `,
});

interface BackLinkProps {
  readonly href: string;
}
const BackLink: React.FC<BackLinkProps> = ({ href }) => (
  <div css={containerStyles}>
    <Link href={href}>
      <span css={iconStyles}>{chevronCircleLeftIcon}</span>Back
    </Link>
  </div>
);

export default BackLink;
