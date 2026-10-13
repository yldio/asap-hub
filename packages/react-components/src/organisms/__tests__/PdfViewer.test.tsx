import { PDFViewer } from '@embedpdf/react-pdf-viewer';
import { render, screen } from '@testing-library/react';

import PdfViewer from '../PdfViewer';

jest.mock('@embedpdf/snippet/dist/pdfium.wasm?url', () => ({
  __esModule: true,
  default: '/assets/pdfium.wasm',
}));

const url = 'https://example.com/grant.pdf';
const title = 'Grant Document PDF';

const expectConfig = (config: object) =>
  expect(PDFViewer).toHaveBeenCalledWith(
    expect.objectContaining({ config: expect.objectContaining(config) }),
    expect.anything(),
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PdfViewer', () => {
  it('views the PDF from its link in a light theme', () => {
    render(<PdfViewer url={url} title={title} />);

    expect(screen.getByRole('region', { name: title })).toBeVisible();
    expectConfig({
      src: url,
      theme: expect.objectContaining({ preference: 'light' }),
    });
  });

  it('offers no download, print or screenshot', () => {
    render(<PdfViewer url={url} title={title} />);

    expectConfig({
      disabledCategories: expect.arrayContaining([
        'document-print',
        'document-export',
        'document-capture',
      ]),
    });
  });

  it('loads PDFium from our own assets and no fonts or stamps from other sites', () => {
    render(<PdfViewer url={url} title={title} />);

    expectConfig({
      wasmUrl: 'http://localhost/assets/pdfium.wasm',
      fontFallback: null,
      fonts: {
        ui: expect.objectContaining({ stylesheetUrl: null }),
        signature: null,
      },
      stamp: { manifests: [] },
    });
  });
});
