// pdfjs-dist ships ESM only (left untransformed under node_modules) and draws
// on canvas, which jsdom lacks, so both pdfjs-dist and its
// web/pdf_viewer.mjs entry resolve here. getDocument never settles by
// default, leaving any rendered viewer in its loading state.
class EventBus {
  listeners = {};

  on(name, listener) {
    this.listeners[name] = [...(this.listeners[name] || []), listener];
  }

  dispatch(name, data) {
    (this.listeners[name] || []).forEach((listener) => listener(data));
  }
}

const PDFViewer = jest.fn(function PDFViewer({ eventBus }) {
  this.eventBus = eventBus;
  this.pagesCount = 0;
  this.currentScaleValue = 'auto';
  this.setDocument = jest.fn((pdfDocument) => {
    this.pagesCount = pdfDocument.numPages;
    eventBus.dispatch('pagesinit');
  });
  this.increaseScale = jest.fn();
  this.decreaseScale = jest.fn();
});

const PDFLinkService = jest.fn(function PDFLinkService() {
  this.setViewer = jest.fn();
  this.setDocument = jest.fn();
});

module.exports = {
  __esModule: true,
  GlobalWorkerOptions: {},
  LinkTarget: { NONE: 0, SELF: 1, BLANK: 2, PARENT: 3, TOP: 4 },
  PDFLinkService,
  getDocument: jest.fn(() => ({
    promise: new Promise(() => {}),
    destroyed: false,
    destroy: jest.fn(() => Promise.resolve()),
  })),
  EventBus,
  PDFViewer,
};
