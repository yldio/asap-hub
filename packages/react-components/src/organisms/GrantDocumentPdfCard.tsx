import { css } from '@emotion/react';
import { lazy, Suspense } from 'react';

import { Card, Headline2 } from '../atoms';
import { Loading } from '../molecules';
import { rem } from '../pixels';

const PdfViewer = lazy(() => import('./PdfViewer'));

const cardStyles = css({
  '@media print': {
    display: 'none',
  },
});

const frameStyles = css({
  position: 'relative',
  marginTop: rem(16),
  aspectRatio: '1 / 1.414',
  borderRadius: rem(16),
  overflow: 'hidden',
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
    <div css={frameStyles}>
      <Suspense fallback={<Loading />}>
        <PdfViewer key={link} url={link} title="Grant Document PDF" />
      </Suspense>
    </div>
  </Card>
);

export default GrantDocumentPdfCard;
