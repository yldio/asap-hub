import { render, screen, waitFor } from '@testing-library/react';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

import GrantDocumentPdfCard from '../GrantDocumentPdfCard';

it('views the grant document link in the PDF viewer', async () => {
  render(<GrantDocumentPdfCard link="https://example.com/grant.pdf" />);

  expect(
    screen.getByRole('heading', { name: 'Grant Document PDF' }),
  ).toBeVisible();
  expect(screen.getByText('Loading PDF...')).toBeVisible();
  await waitFor(() =>
    expect(getDocument).toHaveBeenCalledWith({
      url: 'https://example.com/grant.pdf',
    }),
  );
});
