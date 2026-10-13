import { PDFViewer } from '@embedpdf/react-pdf-viewer';
import { render, screen } from '@testing-library/react';

import GrantDocumentPdfCard from '../GrantDocumentPdfCard';

beforeEach(() => {
  jest.clearAllMocks();
});

it('views the grant document link in the PDF viewer', async () => {
  render(<GrantDocumentPdfCard link="https://example.com/grant.pdf" />);

  expect(
    screen.getByRole('heading', { name: 'Grant Document PDF' }),
  ).toBeVisible();
  expect(screen.getByText('Loading...')).toBeVisible();
  expect(
    await screen.findByRole('region', { name: 'Grant Document PDF' }),
  ).toBeInTheDocument();
  expect(PDFViewer).toHaveBeenCalledWith(
    expect.objectContaining({
      config: expect.objectContaining({
        src: 'https://example.com/grant.pdf',
      }),
    }),
    expect.anything(),
  );
});

it('starts a new viewer for the next grant document', async () => {
  const { rerender } = render(
    <GrantDocumentPdfCard link="https://example.com/original.pdf" />,
  );
  const originalViewer = await screen.findByRole('region', {
    name: 'Grant Document PDF',
  });

  rerender(<GrantDocumentPdfCard link="https://example.com/supplement.pdf" />);

  expect(screen.getByRole('region', { name: 'Grant Document PDF' })).not.toBe(
    originalViewer,
  );
});
