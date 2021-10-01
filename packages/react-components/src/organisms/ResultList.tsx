import { ComponentProps, useContext } from 'react';
import { css } from '@emotion/react';
import { ToastContext } from '@asap-hub/react-context';

import { ListControls, PageControls } from '../molecules';
import { Button, Paragraph } from '../atoms';
import {
  perRem,
  vminLinearCalcClamped,
  mobileScreen,
  tabletScreen,
} from '../pixels';
import { lead } from '../colors';

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

const exportStyles = css({ marginLeft: `${24 / perRem}em` });

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

type ResultListProps = ComponentProps<typeof PageControls> & {
  readonly numberOfItems: number;
  readonly isListView?: boolean;
  readonly exportResults?: () => Promise<void>;
  readonly cardViewHref?: string;
  readonly listViewHref?: string;
  readonly children: React.ReactNode;
};
const ResultList: React.FC<ResultListProps> = ({
  numberOfItems,
  isListView = false,
  exportResults,
  cardViewHref,
  listViewHref,
  children,
  ...pageControlsProps
}) => {
  const toast = useContext(ToastContext);
  return (
    <article>
      <header
        css={[headerStyles, numberOfItems === 0 && headerNoResultsStyles]}
      >
        {numberOfItems > 0 && (
          <Paragraph primary>
            <strong>
              {numberOfItems} result{numberOfItems === 1 || 's'} found
            </strong>
            {exportResults && (
              <span css={exportStyles}>
                <Button
                  linkStyle
                  onClick={() =>
                    exportResults().catch(() =>
                      toast(
                        'There was an issue exporting to CSV. Please try again.',
                      ),
                    )
                  }
                >
                  Export as CSV
                </Button>
              </span>
            )}
          </Paragraph>
        )}
        {cardViewHref && listViewHref && (
          <ListControls
            isListView={isListView}
            cardViewHref={cardViewHref}
            listViewHref={listViewHref}
          />
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
        <main css={{ textAlign: 'center' }}>
          <Paragraph primary>
            <strong>No matches found!</strong>
            <br />
            <span css={{ color: lead.rgb }}>
              We're sorry, we couldn't find results to match your search. Please
              check your spelling or try using fewer words.
            </span>
          </Paragraph>
        </main>
      )}
    </article>
  );
};
export default ResultList;
