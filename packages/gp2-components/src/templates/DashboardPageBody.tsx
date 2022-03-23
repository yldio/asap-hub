import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { PagesSection, NewsSection, pixels } from '@asap-hub/react-components';

const { perRem } = pixels;

const styles = css({
  display: 'grid',
  gridRowGap: `${72 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
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
      <NewsSection title="Latest News from ASAP" news={news} />
    ) : null}
  </div>
);

export default DashboardPageBody;
