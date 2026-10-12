import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getDocument,
  PDFDocumentLoadingTask,
} from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  FindState,
  LinkTarget,
  PDFFindController,
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

const renderLoaded = async (pdfDocument = { numPages: 3 }) => {
  mockLoadingTask(Promise.resolve(pdfDocument));
  render(<PdfViewer url={url} />);
  return screen.findByRole('textbox', { name: 'Page number' });
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PdfViewer', () => {
  it('renders the document at page width with a page counter', async () => {
    mockLoadingTask(Promise.resolve({ numPages: 3 }));
    render(<PdfViewer url={url} />);
    expect(screen.getByText('Loading PDF...')).toBeVisible();

    expect(
      await screen.findByRole('textbox', { name: 'Page number' }),
    ).toHaveValue('1');
    expect(screen.getByText('/ 3')).toBeVisible();
    expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument();
    expect(getDocument).toHaveBeenCalledWith({ url });
    expect(getViewer().currentScaleValue).toBe('page-width');
    expect(
      screen.getByRole('region', { name: 'Grant Document PDF' }),
    ).toBeVisible();
  });

  it('opens links in a new tab and follows links and searches within the document', async () => {
    const pdfDocument = { numPages: 3 };
    await renderLoaded(pdfDocument);

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
    const [findController] = jest.mocked(PDFFindController).mock.instances;
    expect(jest.mocked(findController?.setDocument)).toHaveBeenCalledWith(
      pdfDocument,
    );
  });

  it('updates the page counter when the current page changes', async () => {
    const pageField = await renderLoaded();

    act(() => getViewer().eventBus.dispatch('pagechanging', { pageNumber: 2 }));

    expect(pageField).toHaveValue('2');
  });

  it('goes to the page typed in the page field', async () => {
    const pageField = await renderLoaded();

    await userEvent.clear(pageField);
    await userEvent.type(pageField, '3{Enter}');

    expect(getViewer().currentPageNumber).toBe(3);
  });

  it('ignores a page outside the document', async () => {
    const pageField = await renderLoaded();

    await userEvent.clear(pageField);
    await userEvent.type(pageField, '9');
    await userEvent.tab();

    expect(getViewer().currentPageNumber).toBe(1);
    expect(pageField).toHaveValue('1');
  });

  it('searches the document and steps through the matches', async () => {
    await renderLoaded();
    const dispatch = jest.spyOn(getViewer().eventBus, 'dispatch');
    const findWith = (params: object) =>
      expect(dispatch).toHaveBeenLastCalledWith(
        'find',
        expect.objectContaining(params),
      );

    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Search document' }),
      'grant',
    );
    findWith({ type: '', query: 'grant', highlightAll: true });

    act(() =>
      getViewer().eventBus.dispatch('updatefindmatchescount', {
        matchesCount: { current: 1, total: 3 },
      }),
    );
    expect(screen.getByText('1 of 3')).toBeVisible();

    await userEvent.keyboard('{Enter}');
    findWith({ type: 'again', query: 'grant', findPrevious: false });
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    findWith({ type: 'again', findPrevious: true });
    await userEvent.click(screen.getByRole('button', { name: 'Next match' }));
    findWith({ type: 'again', findPrevious: false });
    await userEvent.click(
      screen.getByRole('button', { name: 'Previous match' }),
    );
    findWith({ type: 'again', findPrevious: true });
  });

  it('scrolls to a match within the viewer, leaving the page where it is', async () => {
    await renderLoaded();
    const viewerBox = screen.getByRole('region', {
      name: 'Grant Document PDF',
    });
    viewerBox.scrollBy = jest.fn();
    jest
      .spyOn(viewerBox, 'getBoundingClientRect')
      .mockReturnValue({ top: 100, left: 0, width: 600 } as DOMRect);
    const match = document.createElement('span');
    const scrollPage = jest.fn();
    match.scrollIntoView = scrollPage;
    jest
      .spyOn(match, 'getBoundingClientRect')
      .mockReturnValue({ top: 900, left: 500, width: 40 } as DOMRect);

    const [findController] = jest.mocked(PDFFindController).mock.instances;
    findController?.scrollMatchIntoView({
      element: match,
      pageIndex: 2,
      matchIndex: 0,
    });

    expect(viewerBox.scrollBy).toHaveBeenCalledWith({ top: 800, left: 220 });
    expect(scrollPage).not.toHaveBeenCalled();
  });

  it('says when a search has no matches', async () => {
    await renderLoaded();
    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Search document' }),
      'grant',
    );
    const reportState = (state: number, total: number) =>
      act(() =>
        getViewer().eventBus.dispatch('updatefindcontrolstate', {
          state,
          matchesCount: { current: Math.min(total, 1), total },
        }),
      );

    reportState(FindState.FOUND, 2);
    reportState(FindState.PENDING, 0);
    expect(screen.getByText('1 of 2')).toBeVisible();

    reportState(FindState.NOT_FOUND, 0);
    expect(screen.getByText('No matches')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Next match' })).toBeDisabled();
  });

  it('switches between fitting the page width and the whole page', async () => {
    await renderLoaded();

    await userEvent.click(screen.getByRole('button', { name: 'Fit to page' }));
    expect(getViewer().currentScaleValue).toBe('page-fit');

    await userEvent.click(screen.getByRole('button', { name: 'Fit to width' }));
    expect(getViewer().currentScaleValue).toBe('page-width');
  });

  it('zooms in and out', async () => {
    await renderLoaded();

    await userEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(jest.mocked(getViewer().increaseScale)).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(jest.mocked(getViewer().decreaseScale)).toHaveBeenCalledTimes(1);
  });

  it('offers no download, print or drive buttons', async () => {
    await renderLoaded({ numPages: 1 });

    expect(
      screen
        .getAllByRole('button')
        .map(
          (button) => button.getAttribute('aria-label') ?? button.textContent,
        ),
    ).toEqual([
      'Previous match',
      'Next match',
      'Fit to page',
      'Zoom out',
      'Zoom in',
    ]);
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

    expect(await screen.findByText('/ 2')).toBeVisible();
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
      await renderLoaded();
      const setScale = jest.fn();
      Object.defineProperty(getViewer(), 'currentScaleValue', {
        get: () => currentScaleValue,
        set: setScale,
      });
      resizeCallback([], {} as ResizeObserver);
      return setScale;
    };

    it.each(['page-width', 'page-fit'])(
      'refits the pages to the new size at %s',
      async (fit) => {
        expect(await resizeAt(fit)).toHaveBeenCalledWith(fit);
      },
    );

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
