import { css } from '@emotion/react';

import { rem } from '../pixels';

// Kept apart from PdfViewer so the card's Suspense fallback can reserve the
// same space without statically importing pdf.js
export const toolbarStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: rem(40),
  marginTop: rem(16),
});

export const frameStyles = css({
  position: 'relative',
  marginTop: rem(16),
  width: '100%',
  aspectRatio: '1 / 1.414',
  borderRadius: rem(16),
  overflow: 'hidden',
});
