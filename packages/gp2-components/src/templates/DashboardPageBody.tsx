import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { PagesSection, pixels, NewsSection } from '@asap-hub/react-components';

const { rem } = pixels;

const styles = css({
  display: 'grid',
  gridRowGap: `${rem(72)}`,
  marginBottom: `${rem(24)}`,
});

type DashboardPageBodyProps = Omit<
  ComponentProps<typeof PagesSection>,
  'title'
> &
  Omit<ComponentProps<typeof NewsSection>, 'title'> & {
    readonly userId: string;
    readonly teamId?: string;
  };

const DashboardPageBody: React.FC<DashboardPageBodyProps> = ({
  pages,
  news,
}) => (
  <div css={styles}>
    {pages.length ? (
      <PagesSection title={'Not sure where to start?'} pages={pages} />
    ) : null}
    {news.length ? (
      <NewsSection title="Latest News from GP2" news={news} />
    ) : null}
  </div>
);

export default DashboardPageBody;
