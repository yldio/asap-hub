import React from 'react';
import { aperture, filter, uniqBy, sortWith, pipe, ascend } from 'ramda';
import css from '@emotion/css';

import {
  perRem,
  tabletScreen,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { steel, fern, tin, lead, mint } from '../colors';
import {
  firstPageIcon,
  nextPageIcon,
  previousPageIcon,
  lastPageIcon,
} from '../icons';
import { Link } from '../atoms';

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
  numPages: number;
  currentIndex: number;
  renderPageHref: (index: number) => string;
}
const PageControls: React.FC<PageControlsProps> = ({
  numPages,
  currentIndex,
  renderPageHref,
}) => {
  if (currentIndex < 0) {
    throw new Error(
      `Current index must not be negative. Received current index: ${currentIndex}.`,
    );
  }
  if (currentIndex >= numPages) {
    throw new Error(
      `Current index must be less than number of pages. Received number of pages: ${numPages}. Received current index: ${currentIndex}.`,
    );
  }

  const firstPageIndex = 0;
  const lastPageIndex = numPages - 1;
  const [firstPageHref, previousPageHref] =
    currentIndex === firstPageIndex
      ? []
      : [renderPageHref(firstPageIndex), renderPageHref(currentIndex - 1)];
  const [nextPageHref, lastPageHref] =
    currentIndex === lastPageIndex
      ? []
      : [renderPageHref(currentIndex + 1), renderPageHref(lastPageIndex)];

  const desiredPages: PageNumber[] = pipe(
    () => [
      { index: firstPageIndex },
      { index: currentIndex - 1, wideScreenOnly: true },
      { index: currentIndex },
      { index: currentIndex + 1, wideScreenOnly: true },
      { index: lastPageIndex },
    ],
    filter<PageNumber>(({ index }) => index >= 0 && index < numPages),
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
          <Link theme={null} href={firstPageHref}>
            <span css={[textStyles, firstPageHref ?? disabledTextStyles]}>
              {firstPageIcon}
            </span>
          </Link>
        </li>
        <li css={itemStyles}>
          <Link theme={null} href={previousPageHref}>
            <span css={[textStyles, previousPageHref ?? disabledTextStyles]}>
              {previousPageIcon}
            </span>
          </Link>
        </li>
        {shownPages.map(({ index, followsGap, wideScreenOnly }) => {
          const active = index === currentIndex;
          return (
            <li
              key={index}
              css={itemStyles}
              className={[
                followsGap ? 'follows-gap' : '',
                wideScreenOnly ? 'wide-screen-only' : '',
              ].join(' ')}
            >
              <Link theme={null} href={renderPageHref(index)}>
                <span css={[textStyles, active && activeTextStyles]}>
                  {index + 1}
                </span>
              </Link>
            </li>
          );
        })}
        <li css={itemStyles}>
          <Link theme={null} href={nextPageHref}>
            <span css={[textStyles, nextPageHref ?? disabledTextStyles]}>
              {nextPageIcon}
            </span>
          </Link>
        </li>
        <li css={itemStyles}>
          <Link theme={null} href={lastPageHref}>
            <span css={[textStyles, lastPageHref ?? disabledTextStyles]}>
              {lastPageIcon}
            </span>
          </Link>
        </li>
      </ol>
    </nav>
  );
};

export default PageControls;
