import { css } from '@emotion/react';
import { PageResponse } from '@asap-hub/model';

import PageCard from './PageCard';
import { perRem, smallDesktopScreen } from '../pixels';
import { Headline2 } from '../atoms';

type PagesProps = {
  readonly title: string;
  readonly pages: ReadonlyArray<PageResponse>;
};

const gridContainerStyles = css({
  display: 'grid',
  gridGap: `${36 / perRem}em`,
  gridTemplateColumns: '1fr 1fr',
  marginTop: `${24 / perRem}em`,

  [`@media (max-width: ${smallDesktopScreen.min}px)`]: {
    gridTemplateColumns: '1fr',
  },
});

const Pages: React.FC<PagesProps> = ({ title, pages }) => (
  <section>
    <Headline2 styleAsHeading={3}>{title}</Headline2>
    <div css={gridContainerStyles}>
      {pages.map((page, idx) => (
        <PageCard key={`page-${idx}`} {...page} />
      ))}
    </div>
  </section>
);

export default Pages;
