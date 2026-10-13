import { PDFViewer } from '@embedpdf/react-pdf-viewer';
import pdfiumPath from '@embedpdf/snippet/dist/pdfium.wasm?url';
import { css } from '@emotion/react';

import { colour } from '../colors';
import { fontStyles } from '../text';

// PDFium runs in a worker loaded from a blob: URL, which can't resolve a
// relative path
const wasmUrl = new URL(pdfiumPath, window.location.href).href;

const disabledCategories = [
  'document-print',
  'document-export',
  'document-capture',
  'capture',
  'document-open',
  'document-close',
  'document-protect',
  'annotation',
  'redaction',
  'insert',
  'form',
  'history',
  'panel-comment',
];

const regionStyles = css({
  position: 'absolute',
  inset: 0,
});

const viewerStyles = css({
  height: '100%',
});

type PdfViewerProps = {
  url: string;
  title: string;
};

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title }) => (
  <div role="region" aria-label={title} css={regionStyles}>
    <PDFViewer
      css={viewerStyles}
      config={{
        src: url,
        wasmUrl,
        fontFallback: null,
        fonts: {
          ui: { stylesheetUrl: null, family: fontStyles.fontFamily },
          signature: null,
        },
        stamp: { manifests: [] },
        theme: {
          preference: 'light',
          light: {
            accent: {
              primary: colour.background.button.primary.default,
              primaryHover: colour.background.button.primary.hover,
              primaryActive: colour.background.button.primary.hover,
              primaryLight: colour.background['hover-brand'],
            },
            interactive: {
              selected: colour.background['hover-brand'],
              focus: colour.border.brand,
              focusRing: colour.background['hover-brand'],
            },
          },
        },
        disabledCategories,
      }}
    />
  </div>
);

export default PdfViewer;
