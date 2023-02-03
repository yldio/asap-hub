/** @jsxImportSource @emotion/react */
import { aperture, filter, uniqBy, sortWith, pipe, ascend } from 'ramda';
import { css, Theme } from '@emotion/react';

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

const textStyles = ({ primary500 = fern }: Theme['colors'] = {}) =>
  css({
    height: '100%',
    display: 'grid',
    justifyContent: 'center',
    alignContent: 'center',

    color: lead.rgb,
    svg: {
      stroke: primary500.rgba,
      verticalAlign: 'middle',
    },
  });
const activeTextStyles = ({
  primary500 = fern,
  primary100 = mint,
}: Theme['colors'] = {}) =>
  css({
    backgroundColor: primary100.rgba,
    color: primary500.rgba,
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
            <span
              css={({ colors }) => [
                textStyles(colors),
                firstPageHref ?? disabledTextStyles,
              ]}
            >
              {firstPageIcon}
            </span>
          </Anchor>
        </li>
        <li css={itemStyles}>
          <Anchor href={previousPageHref}>
            <span
              css={({ colors }) => [
                textStyles(colors),
                previousPageHref ?? disabledTextStyles,
              ]}
            >
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
                <span
                  css={({ colors }) => [
                    textStyles(colors),
                    active && activeTextStyles(colors),
                  ]}
                >
                  {index + 1}
                </span>
              </Anchor>
            </li>
          );
        })}
        <li css={itemStyles}>
          <Anchor href={nextPageHref}>
            <span
              css={({ colors }) => [
                textStyles(colors),
                nextPageHref ?? disabledTextStyles,
              ]}
            >
              {nextPageIcon}
            </span>
          </Anchor>
        </li>
        <li css={itemStyles}>
          <Anchor href={lastPageHref}>
            <span
              css={({ colors }) => [
                textStyles(colors),
                lastPageHref ?? disabledTextStyles,
              ]}
            >
              {lastPageIcon}
            </span>
          </Anchor>
        </li>
      </ol>
    </nav>
  );
};

export default PageControls;
