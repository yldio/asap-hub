import { css } from '@emotion/react';
import { lazy, Suspense } from 'react';

import { Card, Headline2, Paragraph } from '../atoms';

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
    <Suspense fallback={<Paragraph accent="lead">Loading PDF...</Paragraph>}>
      <PdfViewer url={link} />
    </Suspense>
  </Card>
);

export default GrantDocumentPdfCard;
