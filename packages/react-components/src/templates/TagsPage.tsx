import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { rem } from '../pixels';
import TagsPageHeader from './TagsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${rem(36)} ${contentSidePaddingWithNavigation(8)}`,
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
