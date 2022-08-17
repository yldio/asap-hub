import aperture from 'ramda/src/aperture.js';
import filter from 'ramda/src/filter.js';
import uniqBy from 'ramda/src/uniqBy.js';
import sortWith from 'ramda/src/sortWith.js';
import pipe from 'ramda/src/pipe.js';
import ascend from 'ramda/src/ascend.js';
import { css } from '@emotion/react';

import {
  perRem,
  tabletScreen,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { steel, fern, tin, lead, mint, paper } from '../colors';
import {
  firstPageIcon,
  nextPageIcon,
  previousPageIcon,
  lastPageIcon,
} from '../icons';
import { Anchor } from '../atoms';

const containerStyles = css({
  display: 'flex',
  justifyContent: 'center',
});
const listStyles = css({
  margin: 0,
  padding: `${12 / perRem}em`,
  border: `${1 / perRem}em solid ${steel.rgb}`,
  borderRadius: `${6 / perRem}em`,

  display: 'grid',
  gridAutoFlow: 'column',
  gridTemplateRows: `${30 / perRem}em`,
  gridAutoColumns: `${30 / perRem}em`,
  gridGap: vminLinearCalc(mobileScreen, 6, largeDesktopScreen, 12, 'px'),

  backgroundColor: paper.rgb,
});

const itemStyles = css({
  display: 'contents',

  '::before': {
    justifySelf: 'center',
    alignSelf: 'center',

    color: lead.rgb,
  },

  '&.follows-gap::before': {
    content: '"..."',
  },

  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    '&.wide-screen-only': {
      display: 'none',
    },
    '&.wide-screen-only + :not(.wide-screen-only)::before': {
      content: '"..."',
    },
  },
});

const textStyles = css({
  height: '100%',
  display: 'grid',
  justifyContent: 'center',
  alignContent: 'center',

  color: lead.rgb,
  svg: {
    stroke: fern.rgb,
    verticalAlign: 'middle',
  },
});
const activeTextStyles = css({
  backgroundColor: mint.rgb,
  color: fern.rgb,
});
const disabledTextStyles = css({
  svg: {
    stroke: tin.rgb,
  },
});

interface PageNumber {
  index: number;
  wideScreenOnly?: boolean;
  followsGap?: boolean;
}
function* optimizeGaps(pageNumbers: PageNumber[]) {
  if (pageNumbers.length < 2) {
    yield* pageNumbers;
    return;
  }

  yield pageNumbers[0];
  for (const [prev, curr] of aperture(2, pageNumbers)) {
    // No point in leaving a gap of 1 if we can just render the number instead of the ellipsis
    if (prev.index + 1 === curr.index - 1) {
      yield {
        index: curr.index - 1,
        // If one of the adjacent pages is only for wide screens, this filler should be too
        wideScreenOnly: prev.wideScreenOnly || curr.wideScreenOnly,
      };
    }

    yield {
      ...curr,
      followsGap: prev.index + 1 < curr.index - 1,
    };
  }
}
function* makeFillersMandatory(pageNumbers: PageNumber[]) {
  if (pageNumbers.length < 3) {
    yield* pageNumbers;
    return;
  }

  yield pageNumbers[0];
  for (const [prev, curr, next] of aperture(3, pageNumbers)) {
    if (
      prev.index + 1 === curr.index &&
      curr.index === next.index - 1 &&
      !prev.wideScreenOnly &&
      !next.wideScreenOnly
    ) {
      // No point in leaving a gap of 1 on narrow screens if we can just render the number instead of the ellipsis
      yield {
        ...curr,
        wideScreenOnly: false,
      };
    } else {
      yield curr;
    }
  }
  yield pageNumbers[pageNumbers.length - 1];
}

interface PageControlsProps {
  numberOfPages: number;
  currentPageIndex: number;
  renderPageHref: (index: number) => string;
}
const PageControls: React.FC<PageControlsProps> = ({
  numberOfPages,
  currentPageIndex,
  renderPageHref,
}) => {
  if (currentPageIndex < 0) {
    throw new Error(
      `Current index must not be negative. Received current page index: ${currentPageIndex}.`,
    );
  }
  if (currentPageIndex >= numberOfPages) {
    throw new Error(
      `Current index must be less than number of pages. Received number of pages: ${numberOfPages}. Received current page index: ${currentPageIndex}.`,
    );
  }

  const firstPageIndex = 0;
  const lastPageIndex = numberOfPages - 1;
  const [firstPageHref, previousPageHref] =
    currentPageIndex === firstPageIndex
      ? []
      : [renderPageHref(firstPageIndex), renderPageHref(currentPageIndex - 1)];
  const [nextPageHref, lastPageHref] =
    currentPageIndex === lastPageIndex
      ? []
      : [renderPageHref(currentPageIndex + 1), renderPageHref(lastPageIndex)];

  const desiredPages: PageNumber[] = pipe(
    () => [
      { index: firstPageIndex },
      { index: currentPageIndex - 1, wideScreenOnly: true },
      { index: currentPageIndex },
      { index: currentPageIndex + 1, wideScreenOnly: true },
      { index: lastPageIndex },
    ],
    filter<PageNumber>(({ index }) => index >= 0 && index < numberOfPages),
    sortWith([
      ascend(({ index }) => index),
      // sort wideScreenOnly to the back so that uniq does not lose mandatory pages
      ascend(({ wideScreenOnly }) => (wideScreenOnly ? 1 : 0)),
    ]),
    uniqBy(({ index }) => index),
  )();

  const shownPages = Array.from(
    makeFillersMandatory(Array.from(optimizeGaps(desiredPages))),
  );

  return (
    <nav css={containerStyles}>
      <ol css={listStyles}>
        <li css={itemStyles}>
          <Anchor href={firstPageHref}>
            <span css={[textStyles, firstPageHref ?? disabledTextStyles]}>
              {firstPageIcon}
            </span>
          </Anchor>
        </li>
        <li css={itemStyles}>
          <Anchor href={previousPageHref}>
            <span css={[textStyles, previousPageHref ?? disabledTextStyles]}>
              {previousPageIcon}
            </span>
          </Anchor>
        </li>
        {shownPages.map(({ index, followsGap, wideScreenOnly }) => {
          const active = index === currentPageIndex;
          return (
            <li
              key={index}
              css={itemStyles}
              className={[
                followsGap ? 'follows-gap' : '',
                wideScreenOnly ? 'wide-screen-only' : '',
              ].join(' ')}
            >
              <Anchor href={renderPageHref(index)}>
                <span css={[textStyles, active && activeTextStyles]}>
                  {index + 1}
                </span>
              </Anchor>
            </li>
          );
        })}
        <li css={itemStyles}>
          <Anchor href={nextPageHref}>
            <span css={[textStyles, nextPageHref ?? disabledTextStyles]}>
              {nextPageIcon}
            </span>
          </Anchor>
        </li>
        <li css={itemStyles}>
          <Anchor href={lastPageHref}>
            <span css={[textStyles, lastPageHref ?? disabledTextStyles]}>
              {lastPageIcon}
            </span>
          </Anchor>
        </li>
      </ol>
    </nav>
  );
};

export default PageControls;
