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
  LinkTarget,
  PDFLinkService,
  PDFViewer,
} from 'pdfjs-dist/legacy/web/pdf_viewer.mjs';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { useEffect, useRef, useState } from 'react';

import { Button, Paragraph } from '../atoms';
import { minusIcon, plusIcon } from '../icons';
import { rem } from '../pixels';
import { iconButtonStyles } from './shared-event-card-styles';

GlobalWorkerOptions.workerSrc = workerSrc;

const toolbarStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: rem(16),
});

const zoomStyles = css({
  display: 'flex',
  gap: rem(8),
});

const frameStyles = css({
  position: 'relative',
  marginTop: rem(16),
  width: '100%',
  aspectRatio: '1 / 1.414',
  borderRadius: rem(16),
  overflow: 'hidden',
});

const containerStyles = css({
  position: 'absolute',
  inset: 0,
  overflow: 'auto',
});

type PdfViewerProps = {
  url: string;
};

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const viewerRef = useRef<PDFViewer>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
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
    const viewer = new PDFViewer({ container, eventBus, linkService });
    linkService.setViewer(viewer);
    viewerRef.current = viewer;
    eventBus.on('pagesinit', () => {
      viewer.currentScaleValue = 'page-width';
      setPagesCount(viewer.pagesCount);
    });
    eventBus.on('pagechanging', (event: { pageNumber: number }) =>
      setPageNumber(event.pageNumber),
    );

    // ponytail: no wasmUrl/standardFontDataUrl, so scanned images (JBIG2, JPEG 2000)
    // won't decode; serve pdfjs-dist's wasm/ and standard_fonts/ if scans show up
    const loadingTask = getDocument({ url });
    void loadingTask.promise.then(
      (pdfDocument) => {
        viewer.setDocument(pdfDocument);
        linkService.setDocument(pdfDocument);
      },
      () => {
        // the cleanup's destroy() rejects a load still in flight when the url changes
        if (!loadingTask.destroyed) {
          setHasError(true);
        }
      },
    );
    return () => {
      void loadingTask.destroy();
    };
  }, [container, url]);

  if (hasError) {
    return <Paragraph accent="lead">Unable to display this PDF.</Paragraph>;
  }

  return (
    <>
      <div css={toolbarStyles}>
        {pagesCount > 0 ? (
          <>
            <span>
              Page {pageNumber} / {pagesCount}
            </span>
            <div css={zoomStyles}>
              <Button
                small
                noMargin
                aria-label="Zoom out"
                onClick={() => viewerRef.current?.decreaseScale()}
                overrideStyles={iconButtonStyles}
              >
                {minusIcon}
              </Button>
              <Button
                small
                noMargin
                aria-label="Zoom in"
                onClick={() => viewerRef.current?.increaseScale()}
                overrideStyles={iconButtonStyles}
              >
                {plusIcon}
              </Button>
            </div>
          </>
        ) : (
          <Paragraph noMargin accent="lead">
            Loading PDF...
          </Paragraph>
        )}
      </div>
      <div css={frameStyles}>
        <div ref={setContainer} css={containerStyles}>
          <div className="pdfViewer" />
        </div>
      </div>
    </>
  );
};

export default PdfViewer;
