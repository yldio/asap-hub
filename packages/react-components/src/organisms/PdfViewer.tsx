import { css } from '@emotion/react';
// The legacy build polyfills what the modern one calls unguarded
// (Map.getOrInsertComputed, Math.sumPrecise, Uint8Array.toHex), which browsers
// our browserslist still lets in lack. pdf_viewer.mjs reads
// globalThis.pdfjsLib, which pdf.mjs sets, so it must load first.
import {
  getDocument,
  GlobalWorkerOptions,
} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  EventBus,
  FindState,
  LinkTarget,
  PDFFindController,
  PDFLinkService,
  PDFViewer,
} from 'pdfjs-dist/legacy/web/pdf_viewer.mjs';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { useEffect, useRef, useState } from 'react';

import { Button, Paragraph, TextField } from '../atoms';
import { chevronDownIcon, chevronUpIcon, minusIcon, plusIcon } from '../icons';
import { SearchField } from '../molecules';
import { mobileScreen, rem } from '../pixels';
import PdfViewerLayout from './PdfViewerLayout';

GlobalWorkerOptions.workerSrc = workerSrc;

// pdf.js reads each page's text for search with `for await` over a
// ReadableStream, which Safari 26 can't iterate: every page came back empty
// and Safari's searches found nothing. Drop this once Safari can, or pdf.js's
// legacy build polyfills it. (jsdom has no ReadableStream at all.)
if (
  typeof ReadableStream !== 'undefined' &&
  !(Symbol.asyncIterator in ReadableStream.prototype)
) {
  Object.defineProperty(ReadableStream.prototype, Symbol.asyncIterator, {
    configurable: true,
    writable: true,
    async *value(this: ReadableStream<unknown>) {
      const reader = this.getReader();
      try {
        for (;;) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value: chunk } = await reader.read();
          if (done) {
            return;
          }
          yield chunk;
        }
      } finally {
        reader.releaseLock();
      }
    },
  });
}

const controlsStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  whiteSpace: 'nowrap',
});

const searchStyles = css([controlsStyles, { flexGrow: 1 }]);

const growStyles = css({
  flexGrow: 1,
});

const pageFieldStyles = css({
  width: rem(64),
});

// Button stretches to fill its row, and to the full width on mobile; the
// toolbar's buttons keep their own size
const buttonStyles = css({
  flexGrow: 0,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexGrow: 0,
    minWidth: 'auto',
  },
});

type MatchesCount = { current: number; total: number };

const containerStyles = css({
  position: 'absolute',
  inset: 0,
  overflow: 'auto',
});

type PdfViewerProps = {
  url: string;
  title: string;
};

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const viewerRef = useRef<PDFViewer>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageDraft, setPageDraft] = useState<string>();
  const [pagesCount, setPagesCount] = useState(0);
  const [isFitToPage, setIsFitToPage] = useState(false);
  const [query, setQuery] = useState('');
  // undefined until pdf.js reports a result for the current query
  const [matches, setMatches] = useState<MatchesCount>();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!container) {
      return undefined;
    }
    const eventBus = new EventBus();
    const linkService = new PDFLinkService({
      eventBus,
      externalLinkTarget: LinkTarget.BLANK,
    });
    const findController = new PDFFindController({ eventBus, linkService });
    // pdf.js scrolls to a match with Element.scrollIntoView, which also
    // scrolls the page around the viewer and pushes the toolbar off screen
    const scrollMatchIntoView =
      findController.scrollMatchIntoView.bind(findController);
    findController.scrollMatchIntoView = (match) => {
      match.element.scrollIntoView = () => {
        const matchBox = match.element.getBoundingClientRect();
        const containerBox = container.getBoundingClientRect();
        container.scrollBy({
          top:
            matchBox.top -
            containerBox.top -
            (parseFloat(getComputedStyle(match.element).scrollMarginTop) ||
              0),
          left:
            matchBox.left +
            matchBox.width / 2 -
            containerBox.left -
            containerBox.width / 2,
        });
      };
      scrollMatchIntoView(match);
    };
    const viewer = new PDFViewer({
      container,
      eventBus,
      linkService,
      findController,
    });
    linkService.setViewer(viewer);
    viewerRef.current = viewer;
    eventBus.on('pagesinit', () => {
      // in the A4-shaped frame, fitting the page also fits its width, so a
      // separate fit-to-width option would do nothing
      viewer.currentScaleValue = 'page-fit';
      setPagesCount(viewer.pagesCount);
    });
    eventBus.on('pagechanging', (event: { pageNumber: number }) =>
      setPageNumber(event.pageNumber),
    );
    eventBus.on('scalechanging', (event: { presetValue?: string }) =>
      setIsFitToPage(event.presetValue === 'page-fit'),
    );
    // pdf.js reports 0 of 0 until it selects a match, so only NOT_FOUND
    // means there are none
    const showMatches = (matchesCount: MatchesCount) => {
      if (matchesCount.total > 0) {
        setMatches(matchesCount);
      }
    };
    eventBus.on(
      'updatefindmatchescount',
      (event: { matchesCount: MatchesCount }) =>
        showMatches(event.matchesCount),
    );
    eventBus.on(
      'updatefindcontrolstate',
      (event: { state: number; matchesCount: MatchesCount }) => {
        if (event.state === FindState.NOT_FOUND) {
          setMatches({ current: 0, total: 0 });
        } else if (event.state !== FindState.PENDING) {
          // a pending search still reports the previous query's count
          showMatches(event.matchesCount);
        }
      },
    );
    // PDFViewer only applies 'page-fit' when it is set, so re-apply it on
    // resize unless the user has zoomed. border-box keeps a scrollbar
    // appearing from triggering it again.
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => {
            if (viewer.currentScaleValue === 'page-fit') {
              viewer.currentScaleValue = 'page-fit';
            }
          });
    resizeObserver?.observe(container, { box: 'border-box' });

    // ponytail: no wasmUrl/standardFontDataUrl, so scanned images (JBIG2, JPEG 2000)
    // won't decode; serve pdfjs-dist's wasm/ and standard_fonts/ if scans show up
    const loadingTask = getDocument({ url });
    void loadingTask.promise
      .then((pdfDocument) => {
        viewer.setDocument(pdfDocument);
        linkService.setDocument(pdfDocument);
        // rejects when the first page can't be read, which no event reports
        return viewer.pagesPromise;
      })
      .catch(() => {
        // the cleanup's destroy() rejects a load still in flight
        if (!loadingTask.destroyed) {
          setHasError(true);
        }
      });
    return () => {
      resizeObserver?.disconnect();
      // drops the listeners pdf.js keeps on document, which would otherwise
      // hold the viewer and its pages after unmount
      viewer.setDocument(null);
      linkService.setDocument(null);
      void loadingTask.destroy();
    };
  }, [container, url]);

  if (hasError) {
    return <Paragraph accent="lead">Unable to display this PDF.</Paragraph>;
  }

  const goToPage = () => {
    const page = Number(pageDraft);
    if (
      viewerRef.current &&
      Number.isInteger(page) &&
      page >= 1 &&
      page <= pagesCount
    ) {
      viewerRef.current.currentPageNumber = page;
    }
    setPageDraft(undefined);
  };

  const find = (findQuery: string, again = false, findPrevious = false) =>
    viewerRef.current?.eventBus.dispatch('find', {
      source: null,
      type: again ? 'again' : '',
      query: findQuery,
      caseSensitive: false,
      entireWord: false,
      highlightAll: true,
      findPrevious,
      matchDiacritics: false,
    });

  return (
    <PdfViewerLayout
      toolbar={
        pagesCount > 0 ? (
          <>
            <div css={controlsStyles}>
              <div css={pageFieldStyles}>
                <TextField
                  aria-label="Page number"
                  value={pageDraft ?? String(pageNumber)}
                  onChange={setPageDraft}
                  onBlur={goToPage}
                  onKeyDown={(event) => event.key === 'Enter' && goToPage()}
                />
              </div>
              <span>/ {pagesCount}</span>
            </div>
            <div role="search" css={searchStyles}>
              <div css={growStyles}>
                <SearchField
                  trackSearch={false}
                  aria-label="Search document"
                  placeholder="Search document"
                  value={query}
                  onChange={(newQuery) => {
                    setQuery(newQuery);
                    setMatches(undefined);
                    find(newQuery);
                  }}
                  onKeyDown={(event) =>
                    event.key === 'Enter' && find(query, true, event.shiftKey)
                  }
                />
              </div>
              <span aria-live="polite">
                {query &&
                  matches &&
                  (matches.total
                    ? `${matches.current} of ${matches.total}`
                    : 'No matches')}
              </span>
              <Button
                noMargin
                aria-label="Previous match"
                enabled={Boolean(matches?.total)}
                onClick={() => find(query, true, true)}
                overrideStyles={buttonStyles}
              >
                {chevronUpIcon}
              </Button>
              <Button
                noMargin
                aria-label="Next match"
                enabled={Boolean(matches?.total)}
                onClick={() => find(query, true)}
                overrideStyles={buttonStyles}
              >
                {chevronDownIcon}
              </Button>
            </div>
            <div css={controlsStyles}>
              <Button
                noMargin
                enabled={!isFitToPage}
                overrideStyles={buttonStyles}
                onClick={() => {
                  if (viewerRef.current) {
                    viewerRef.current.currentScaleValue = 'page-fit';
                  }
                }}
              >
                Fit to page
              </Button>
              <Button
                noMargin
                aria-label="Zoom out"
                onClick={() => viewerRef.current?.decreaseScale()}
                overrideStyles={buttonStyles}
              >
                {minusIcon}
              </Button>
              <Button
                noMargin
                aria-label="Zoom in"
                onClick={() => viewerRef.current?.increaseScale()}
                overrideStyles={buttonStyles}
              >
                {plusIcon}
              </Button>
            </div>
          </>
        ) : undefined
      }
    >
      <div
        ref={setContainer}
        role="region"
        aria-label={title}
        css={containerStyles}
      >
        <div className="pdfViewer" />
      </div>
    </PdfViewerLayout>
  );
};

export default PdfViewer;
