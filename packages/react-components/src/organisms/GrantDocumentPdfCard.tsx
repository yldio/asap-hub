import { css } from '@emotion/react';
import { lazy, Suspense } from 'react';

import { Card, Headline2, Paragraph } from '../atoms';
import { frameStyles, toolbarStyles } from './shared-pdf-viewer-styles';

const PdfViewer = lazy(() => import('./PdfViewer'));

const cardStyles = css({
  '@media print': {
    display: 'none',
  },
});

type GrantDocumentPdfCardProps = {
  link: string;
};

const GrantDocumentPdfCard: React.FC<GrantDocumentPdfCardProps> = ({
  link,
}) => (
  <Card overrideStyles={cardStyles}>
    <Headline2 styleAsHeading={4} noMargin>
      Grant Document PDF
    </Headline2>
    <Suspense
      fallback={
        <>
          <div css={toolbarStyles}>
            <Paragraph noMargin accent="lead">
              Loading PDF...
            </Paragraph>
          </div>
          <div css={frameStyles} />
        </>
      }
    >
      <PdfViewer url={link} />
    </Suspense>
  </Card>
);

export default GrantDocumentPdfCard;
