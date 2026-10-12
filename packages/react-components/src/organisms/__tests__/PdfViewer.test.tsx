import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getDocument,
  PDFDocumentLoadingTask,
} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  LinkTarget,
  PDFLinkService,
  PDFViewer,
} from 'pdfjs-dist/legacy/web/pdf_viewer.mjs';

import PdfViewer from '../PdfViewer';

const url = 'https://example.com/grant.pdf';

const mockLoadingTask = (load: Promise<unknown>) => {
  let rejectOnDestroy: (reason: Error) => void = jest.fn();
  const loadingTask = {
    promise: Promise.race([
      load,
      new Promise((_resolve, reject) => {
        rejectOnDestroy = reject;
      }),
    ]),
    destroyed: false,
    destroy: jest.fn(() => {
      loadingTask.destroyed = true;
      rejectOnDestroy(new Error('Worker was destroyed'));
      return Promise.resolve();
    }),
  };
  jest
    .mocked(getDocument)
    .mockReturnValueOnce(loadingTask as unknown as PDFDocumentLoadingTask);
  return loadingTask;
};

const getViewer = () => {
  const [viewer] = jest.mocked(PDFViewer).mock.instances;
  if (!viewer) {
    throw new Error('No PDFViewer was created');
  }
  return viewer;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PdfViewer', () => {
  it('renders the document at page width with a page counter', async () => {
    mockLoadingTask(Promise.resolve({ numPages: 3 }));
    render(<PdfViewer url={url} />);
    expect(screen.getByText('Loading PDF...')).toBeVisible();

    expect(await screen.findByText('Page 1 / 3')).toBeVisible();
    expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
    expect(getDocument).toHaveBeenCalledWith({ url });
    expect(getViewer().currentScaleValue).toBe('page-width');
  });

  it('opens links in a new tab and follows links within the document', async () => {
    const pdfDocument = { numPages: 3 };
    mockLoadingTask(Promise.resolve(pdfDocument));
    render(<PdfViewer url={url} />);
    await screen.findByText('Page 1 / 3');

    expect(PDFLinkService).toHaveBeenCalledWith(
      expect.objectContaining({ externalLinkTarget: LinkTarget.BLANK }),
    );
    const [linkService] = jest.mocked(PDFLinkService).mock.instances;
    expect(jest.mocked(linkService?.setViewer)).toHaveBeenCalledWith(
      getViewer(),
    );
    expect(jest.mocked(linkService?.setDocument)).toHaveBeenCalledWith(
      pdfDocument,
    );
  });

  it('updates the page counter when the current page changes', async () => {
    mockLoadingTask(Promise.resolve({ numPages: 3 }));
    render(<PdfViewer url={url} />);
    await screen.findByText('Page 1 / 3');

    act(() => getViewer().eventBus.dispatch('pagechanging', { pageNumber: 2 }));

    expect(screen.getByText('Page 2 / 3')).toBeVisible();
  });

  it('zooms in and out', async () => {
    mockLoadingTask(Promise.resolve({ numPages: 3 }));
    render(<PdfViewer url={url} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Zoom in' }));
    expect(jest.mocked(getViewer().increaseScale)).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(jest.mocked(getViewer().decreaseScale)).toHaveBeenCalledTimes(1);
  });

  it('offers no download, print or drive buttons', async () => {
    mockLoadingTask(Promise.resolve({ numPages: 1 }));
    render(<PdfViewer url={url} />);
    await screen.findByText('Page 1 / 1');

    expect(
      screen
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label')),
    ).toEqual(['Zoom out', 'Zoom in']);
  });

  it('shows a message when the PDF cannot be loaded', async () => {
    mockLoadingTask(Promise.reject(new Error('Blocked by CORS')));
    render(<PdfViewer url={url} />);

    expect(
      await screen.findByText('Unable to display this PDF.'),
    ).toBeVisible();
  });

  it('loads the new link without an error when the link changes mid-load', async () => {
    const abandonedTask = mockLoadingTask(new Promise(() => {}));
    mockLoadingTask(Promise.resolve({ numPages: 2 }));
    const { rerender } = render(<PdfViewer url={url} />);

    rerender(<PdfViewer url="https://example.com/supplement.pdf" />);

    expect(await screen.findByText('Page 1 / 2')).toBeVisible();
    expect(abandonedTask.destroy).toHaveBeenCalled();
    expect(
      screen.queryByText('Unable to display this PDF.'),
    ).not.toBeInTheDocument();
  });

  it('stops loading the PDF on unmount', () => {
    const loadingTask = mockLoadingTask(new Promise(() => {}));
    const { unmount } = render(<PdfViewer url={url} />);

    unmount();

    expect(loadingTask.destroy).toHaveBeenCalled();
  });

  describe('when the viewer resizes', () => {
    let resizeCallback: ResizeObserverCallback;
    const disconnect = jest.fn();

    beforeEach(() => {
      globalThis.ResizeObserver = jest.fn((callback) => {
        resizeCallback = callback;
        return { observe: jest.fn(), disconnect, unobserve: jest.fn() };
      }) as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
      delete (globalThis as Partial<typeof globalThis>).ResizeObserver;
    });

    const resizeAt = async (currentScaleValue: string) => {
      mockLoadingTask(Promise.resolve({ numPages: 3 }));
      render(<PdfViewer url={url} />);
      await screen.findByText('Page 1 / 3');
      const setScale = jest.fn();
      Object.defineProperty(getViewer(), 'currentScaleValue', {
        get: () => currentScaleValue,
        set: setScale,
      });
      resizeCallback([], {} as ResizeObserver);
      return setScale;
    };

    it('refits the pages to the new width', async () => {
      expect(await resizeAt('page-width')).toHaveBeenCalledWith('page-width');
    });

    it('keeps the zoom the user picked', async () => {
      expect(await resizeAt('1.5')).not.toHaveBeenCalled();
    });

    it('stops observing on unmount', () => {
      mockLoadingTask(new Promise(() => {}));
      const { unmount } = render(<PdfViewer url={url} />);

      unmount();

      expect(disconnect).toHaveBeenCalled();
    });
  });
});
