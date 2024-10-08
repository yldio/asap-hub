import React, { ComponentProps, useEffect } from 'react';
import { css } from '@emotion/react';

import { ExportButton, ListControls, PageControls } from '../molecules';
import { Headline3, Paragraph } from '../atoms';
import {
  perRem,
  vminLinearCalcClamped,
  mobileScreen,
  tabletScreen,
} from '../pixels';
import { charcoal } from '../colors';

const headerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: `${12 / perRem}em`,
  justifyContent: 'space-between',
  alignItems: 'center',
});

const headerNoResultsStyles = css({
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    justifyContent: 'flex-end',
  },
});

const resultsHeaderStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',

  [`@media (max-width: ${tabletScreen.min}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const viewOptionsStyles = css({
  display: 'flex',
  gap: `${33 / perRem}em`,
  [`@media (max-width: ${tabletScreen.min}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    gap: 0,
  },
});

const mainStyles = css({
  justifySelf: 'stretch',
  paddingTop: `${18 / perRem}em`,
  paddingBottom: `${36 / perRem}em`,

  display: 'grid',
  gridRowGap: `${vminLinearCalcClamped(
    mobileScreen,
    24,
    tabletScreen,
    36,
    'px',
  )}`,
  boxSizing: 'border-box',
  maxWidth: '100%',
  overflow: 'hidden',
});
const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: `${36 / perRem}em`,
  paddingBottom: `${36 / perRem}em`,
});

const iconStyles = css({
  color: charcoal.rgb,
  display: 'inline-flex',
  svg: {
    width: `${48 / perRem}em`,
    height: `${48 / perRem}em`,
  },
});

type ResultListProps = ComponentProps<typeof PageControls> & {
  readonly icon?: React.ReactElement;
  readonly numberOfItems: number;
  readonly isListView?: boolean;
  readonly exportResults?: () => Promise<void>;
  readonly cardViewHref?: string;
  readonly listViewHref?: string;
  readonly noResultsComponent?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly algoliaIndexName?: string;
};
const ResultList: React.FC<ResultListProps> = ({
  icon,
  numberOfItems,
  isListView = false,
  exportResults,
  cardViewHref,
  listViewHref,
  children,
  noResultsComponent,
  algoliaIndexName,
  ...pageControlsProps
}) => {
  useEffect(() => {
    if (algoliaIndexName) {
      window.dataLayer?.push({ event: 'Hits Viewed' });
    }
  }, [algoliaIndexName, pageControlsProps.currentPageIndex]);
  return (
    <article data-insights-index={algoliaIndexName}>
      <header
        css={[headerStyles, numberOfItems === 0 && headerNoResultsStyles]}
      >
        {numberOfItems > 0 && (
          <div css={exportResults && resultsHeaderStyles}>
            <strong>
              {numberOfItems} result{numberOfItems === 1 || 's'} found
            </strong>

            <span css={viewOptionsStyles}>
              {cardViewHref && listViewHref && (
                <ListControls
                  isListView={isListView}
                  cardViewHref={cardViewHref}
                  listViewHref={listViewHref}
                />
              )}
              <ExportButton exportResults={exportResults} />
            </span>
          </div>
        )}
      </header>
      {numberOfItems > 0 ? (
        <>
          <main css={mainStyles}>{children}</main>
          <section css={pageControlsStyles}>
            <PageControls {...pageControlsProps} />
          </section>
        </>
      ) : (
        noResultsComponent ?? (
          <main css={{ textAlign: 'center' }}>
            {icon && <span css={iconStyles}>{icon}</span>}
            <Headline3>No results have been found.</Headline3>
            <Paragraph accent="lead">
              Please double-check your search for any typos or try a different
              search term.
            </Paragraph>
          </main>
        )
      )}
    </article>
  );
};
export default ResultList;
