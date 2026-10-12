import { css } from '@emotion/react';

import { borderWidth, textPaddingBottom, textPaddingTop } from '../form';
import { lineHeight, rem } from '../pixels';

// Kept apart from PdfViewer so the card's Suspense fallback can reserve the
// same space without statically importing pdf.js
export const toolbarStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: rem(18),
  minHeight: rem(
    textPaddingTop + lineHeight + textPaddingBottom + 2 * borderWidth,
  ),
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
