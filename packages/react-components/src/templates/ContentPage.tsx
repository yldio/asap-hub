import { PageResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { Display } from '../atoms';
import { contentSidePaddingWithNavigation } from '../layout';
import { RichText } from '../organisms';
import { perRem } from '../pixels';

const styles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type ContentPageProps = Pick<PageResponse, 'text' | 'title'>;
const ContentPage: React.FC<ContentPageProps> = ({ text, title }) => (
  <article css={({ components }) => [styles, components?.ContentPage?.styles]}>
    <Display>{title}</Display>
    <RichText toc text={text} />
  </article>
);

export default ContentPage;
