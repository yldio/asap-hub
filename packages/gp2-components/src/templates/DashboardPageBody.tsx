import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { PagesSection, pixels, NewsSection } from '@asap-hub/react-components';
import { Link } from '@asap-hub/react-components/build';
import { news as newsRoute } from '@asap-hub/routing/build';
import { perRem } from '@asap-hub/react-components/build/pixels';

const { rem } = pixels;

const styles = css({
  display: 'grid',
  gridRowGap: `${rem(72)}`,
  marginBottom: `${rem(24)}`,
});

const viewAllStyles = css({
  marginTop: `${24 / perRem}em`,
  textAlign: 'right',
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
      <div>
        <NewsSection
          title="Latest News"
          subtitle="Explore the latest shared research and learn more about them."
          news={[news[0]]}
        />
        <p css={viewAllStyles} data-testid="view-news">
          <Link href={newsRoute({}).$}>View All →</Link>
        </p>
      </div>
    ) : null}
  </div>
);

export default DashboardPageBody;
