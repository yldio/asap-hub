import React from 'react';
import css from '@emotion/css';
import { PageResponse } from '@asap-hub/model';

import PageCard from './PageCard';
import { perRem, smallDesktopScreen } from '../pixels';
import { Display } from '../atoms';

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
    <Display styleAsHeading={3}>{title}</Display>
    <div css={gridContainerStyles}>
      {pages.map((page, idx) => (
        <PageCard key={`page-${idx}`} {...page} />
      ))}
    </div>
  </section>
);

export default Pages;
