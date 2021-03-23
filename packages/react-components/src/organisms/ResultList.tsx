import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { PageControls } from '../molecules';
import { Paragraph } from '../atoms';
import {
  perRem,
  vminLinearCalcClamped,
  mobileScreen,
  tabletScreen,
} from '../pixels';

const headerStyles = css({
  justifySelf: 'start',
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

  readonly children: React.ReactNode;
};
const ResultList: React.FC<ResultListProps> = ({
  numberOfItems,
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
    </header>
    {numberOfItems > 0 && <main css={mainStyles}>{children}</main>}
    <section css={pageControlsStyles}>
      <PageControls {...pageControlsProps} />
    </section>
  </article>
);

export default ResultList;
