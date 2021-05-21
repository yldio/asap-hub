import { css } from '@emotion/react';
import { PageResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import { Display } from '../atoms';
import { RichText } from '../organisms';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type ContentPageProps = Pick<PageResponse, 'text' | 'title'>;
const ContentPage: React.FC<ContentPageProps> = ({ text, title }) => (
  <article css={styles}>
    <Display>{title}</Display>
    <RichText toc text={text} />
  </article>
);

export default ContentPage;
