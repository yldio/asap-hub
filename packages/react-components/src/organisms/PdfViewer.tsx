import { css } from '@emotion/react';
// The legacy build polyfills APIs the modern one needs, such as
// Map.getOrInsertComputed, which some supported browsers lack.
// pdf_viewer.mjs reads globalThis.pdfjsLib, so pdf.mjs must load first.
import {
  AnnotationEditorType,
  getDocument,
  GlobalWorkerOptions,
} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  EventBus,
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

// pdf.js's search reads page text with `for await` over a ReadableStream,
// which Safari 26 doesn't support yet. jsdom has no ReadableStream.
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

const growStyles = css({
  flexGrow: 1,
});

const searchStyles = css([controlsStyles, growStyles]);

const pageFieldStyles = css({
  width: rem(64),
});

// Stop Button growing to fill its row, and to full width on mobile
const buttonProps = {
  noMargin: true,
  overrideStyles: css({
    flexGrow: 0,
    [`@media (max-width: ${mobileScreen.max}px)`]: {
      flexGrow: 0,
      minWidth: 'auto',
    },
  }),
};

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
    // Mid-search, pdf.js reports 0 of 0 or the previous query's count, so
    // only report once every page is searched
    const findController = new PDFFindController({
      eventBus,
      linkService,
      updateMatchesCountOnProgress: false,
    });
    // pdf.js's scrollIntoView also scrolls the page, hiding the toolbar
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
      annotationEditorMode: AnnotationEditorType.DISABLE,
    });
    linkService.setViewer(viewer);
    viewerRef.current = viewer;
    eventBus.on('pagesinit', () => {
      viewer.currentScaleValue = 'page-fit';
      setPagesCount(viewer.pagesCount);
    });
    eventBus.on('pagechanging', (event: { pageNumber: number }) =>
      setPageNumber(event.pageNumber),
    );
    eventBus.on('scalechanging', (event: { presetValue?: string }) =>
      setIsFitToPage(event.presetValue === 'page-fit'),
    );
    const showMatches = (event: { matchesCount: MatchesCount }) =>
      setMatches(event.matchesCount);
    eventBus.on('updatefindmatchescount', showMatches);
    eventBus.on('updatefindcontrolstate', showMatches);
    // PDFViewer fits the page only when 'page-fit' is set, so re-apply it on
    // resize. border-box ignores scrollbars, which would retrigger it.
    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => {
            if (viewer.currentScaleValue === 'page-fit') {
              viewer.currentScaleValue = 'page-fit';
            }
          });
    resizeObserver?.observe(container, { box: 'border-box' });

    // No wasmUrl or standardFontDataUrl: scanned images (JBIG2, JPEG 2000)
    // won't decode. Serve pdfjs-dist's wasm/ and standard_fonts/ if needed.
    const loadingTask = getDocument({ url });
    void loadingTask.promise
      .then((pdfDocument) => {
        viewer.setDocument(pdfDocument);
        linkService.setDocument(pdfDocument);
        // rejects when the first page can't be read
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
      // releases the listeners pdf.js adds to document
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

  const hasMatches = Boolean(matches?.total);
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
                  (hasMatches
                    ? `${matches.current} of ${matches.total}`
                    : 'No matches')}
              </span>
              <Button
                {...buttonProps}
                aria-label="Previous match"
                enabled={hasMatches}
                onClick={() => find(query, true, true)}
              >
                {chevronUpIcon}
              </Button>
              <Button
                {...buttonProps}
                aria-label="Next match"
                enabled={hasMatches}
                onClick={() => find(query, true)}
              >
                {chevronDownIcon}
              </Button>
            </div>
            <div css={controlsStyles}>
              <Button
                {...buttonProps}
                enabled={!isFitToPage}
                onClick={() => {
                  if (viewerRef.current) {
                    viewerRef.current.currentScaleValue = 'page-fit';
                  }
                }}
              >
                Fit to page
              </Button>
              <Button
                {...buttonProps}
                aria-label="Zoom out"
                onClick={() => viewerRef.current?.decreaseScale()}
              >
                {minusIcon}
              </Button>
              <Button
                {...buttonProps}
                aria-label="Zoom in"
                onClick={() => viewerRef.current?.increaseScale()}
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
