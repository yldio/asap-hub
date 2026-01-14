import { css, SerializedStyles } from '@emotion/react';
import { ReactNode } from 'react';
import { MAX_PAGE_CONTENT_WIDTH } from '../layout';

import { rem, smallDesktopScreen } from '../pixels';

const containerStyles = css({
  display: 'flex',
  flexFlow: 'column',
  padding: `${rem(48)} ${rem(88)}`,
  [`@media (max-width: ${smallDesktopScreen.width - 1}px)`]: {
    padding: `${rem(48)} ${rem(24)}`,
  },
});

const constrainedContainerStyles = css({
  maxWidth: rem(MAX_PAGE_CONTENT_WIDTH),
  width: '100%',
  margin: '0 auto',
});

const noPaddingBottomStyles = css({
  paddingBottom: 0,
  [`@media (max-width: ${smallDesktopScreen.width - 1}px)`]: {
    paddingBottom: 0,
  },
});

const noPaddingTopStyles = css({
  paddingTop: 0,
  [`@media (max-width: ${smallDesktopScreen.width - 1}px)`]: {
    paddingTop: 0,
  },
});

type PageConstraintsProps = {
  children: ReactNode;
  as?: 'header' | 'main' | 'div' | 'article';
  noPaddingBottom?: boolean;
  noPaddingTop?: boolean;
  unconstrainedStyles?: SerializedStyles;
};

/**
 * A layout component that provides consistent page-width constraints and horizontal
 * padding across different screen sizes.
 *
 * Use `PageConstraints` to create consistent layout boundaries for page sections.
 * It applies responsive horizontal padding and max-width constraints to ensure
 * content sections behave uniformly across different screen sizes and
 * maintains visual consistency throughout the application.
 */
const PageConstraints: React.FC<PageConstraintsProps> = ({
  children,
  as: Component = 'div',
  noPaddingBottom,
  noPaddingTop,
  unconstrainedStyles,
}) => (
  <Component
    css={css([
      containerStyles,
      noPaddingTop && noPaddingTopStyles,
      noPaddingBottom && noPaddingBottomStyles,
      unconstrainedStyles,
    ])}
  >
    <div css={constrainedContainerStyles}>{children}</div>
  </Component>
);

export default PageConstraints;
