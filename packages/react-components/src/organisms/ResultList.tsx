import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { isEnabled } from '@asap-hub/flags';

import { ListControls, PageControls } from '../molecules';
import { Paragraph } from '../atoms';
import {
  perRem,
  vminLinearCalcClamped,
  mobileScreen,
  tabletScreen,
} from '../pixels';

const headerStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
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
});
const pageControlsStyles = css({
  justifySelf: 'center',
  paddingTop: `${36 / perRem}em`,
  paddingBottom: `${36 / perRem}em`,
});

type ResultListProps = ComponentProps<typeof PageControls> & {
  readonly numberOfItems: number;
  readonly listView?: boolean;
  readonly cardViewHref?: string;
  readonly listViewHref?: string;
  readonly children: React.ReactNode;
};
const ResultList: React.FC<ResultListProps> = ({
  numberOfItems,
  listView = false,
  cardViewHref,
  listViewHref,
  children,
  ...pageControlsProps
}) => (
  <article>
    <header css={headerStyles}>
      <Paragraph primary>
        <strong>
          {numberOfItems} result{numberOfItems === 1 || 's'} found
        </strong>
      </Paragraph>
      {isEnabled('LIST_VIEW') && cardViewHref && listViewHref && (
        <ListControls
          listView={listView}
          cardViewHref={cardViewHref}
          listViewHref={listViewHref}
        />
      )}
    </header>
    {numberOfItems > 0 && <main css={mainStyles}>{children}</main>}
    <section css={pageControlsStyles}>
      <PageControls {...pageControlsProps} />
    </section>
  </article>
);

export default ResultList;
