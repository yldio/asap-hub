import React from 'react';
import css from '@emotion/css';
import { PageResponse } from '@asap-hub/model';

import { perRem, smallDesktopScreen } from '../pixels';
import { Display } from '../atoms';
import { PageCard } from '.';

type WhereToStartProps = {
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

const WhereToStart: React.FC<WhereToStartProps> = ({ pages }) => {
  return (
    <section>
      <Display styleAsHeading={2}>Not sure where to start?</Display>
      <div css={gridContainerStyles}>
        {pages.map((page, idx) => (
          <PageCard key={`page-${idx}`} {...page} href="#" />
        ))}
      </div>
    </section>
  );
};

export default WhereToStart;
