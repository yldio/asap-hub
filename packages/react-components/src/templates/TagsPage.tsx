import { css } from '@emotion/react';

import { perRem } from '../pixels';
import TagsPageHeader from './TagsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';
import { ComponentProps } from 'react';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const TagsPage: React.FC<ComponentProps<typeof TagsPageHeader>> = ({
  children,
  ...props
}) => (
  <article>
    <TagsPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default TagsPage;
