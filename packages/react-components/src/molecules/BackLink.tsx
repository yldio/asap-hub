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

const noPaddingStyles = css({
  padding: 0,
});

interface BackLinkProps {
  readonly href: string;
  readonly noPadding?: boolean;
}
const BackLink: React.FC<BackLinkProps> = ({ href, noPadding = false }) => (
  <div css={[containerStyles, noPadding && noPaddingStyles]}>
    <Link
      href={href}
      onClick={(event) => {
        if (window.history.state?.idx > 0) {
          event.preventDefault();
          window.history.back();
        }
      }}
    >
      <span css={iconStyles}>{chevronCircleLeftIcon}</span>Back
    </Link>
  </div>
);

export default BackLink;
