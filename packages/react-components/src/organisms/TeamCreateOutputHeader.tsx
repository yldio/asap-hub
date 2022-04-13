import React from 'react';
import { css } from '@emotion/react';
import { ResearchOutputDocumentType } from '@asap-hub/model';

import { news } from '@asap-hub/routing';
import { Display, Link, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const visualHeaderStyles = css({
  marginBottom: `${30 / perRem}em`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const headerCopy = (outputDocumentType: ResearchOutputDocumentType) => {
  switch (outputDocumentType) {
    case 'Protocol':
      return 'Share a protocol';
    case 'Dataset':
      return 'Share a dataset';
    case 'Bioinformatics':
      return 'Share bioinformatics';
    case 'Lab Resource':
      return 'Share a lab resource';
    case 'Article':
      return 'Share an article';
    default:
      return 'Share a resource';
  }
};

const SubheaderCopy: React.FC<{
  outputDocumentType: ResearchOutputDocumentType;
}> = ({ outputDocumentType }) => {
  const protocolsIoLink = news({}).article({
    articleId: '7d3dd1ec-14ef-441c-8a2c-19a23d6264f3',
  }).$;
  const zenodoLink = news({}).article({
    articleId: '735944ac-5641-431f-8984-bf53972dfd4e',
  }).$;
  switch (outputDocumentType) {
    case 'Protocol':
      return (
        <>
          Add your protocol to a repository (e.g. protocols.io) before sharing
          on the Hub. Find out{' '}
          <Link href={protocolsIoLink}>how to add to protocols.io</Link> to get
          started.
        </>
      );
    case 'Dataset':
      return (
        <>
          Add your dataset to a platform (e.g. Zenodo) before sharing on the
          Hub. Find out <Link href={zenodoLink}>how to add to Zenodo</Link> to
          get started.
        </>
      );
    case 'Bioinformatics':
      return (
        <>
          Add bioinformatics, such as scripts or software, to a platform (e.g.
          Github) before sharing on the Hub.
        </>
      );
    case 'Lab Resource':
      return (
        <>
          Add your lab resource to a repository (e.g. Addgene or WiCell) before
          sharing on the Hub, if possible. Alternatively, find out{' '}
          <Link
            href={
              'https://drive.google.com/file/d/1qJ2nbqFl5AquhgvUwwxxyOL_k_BMaD2X/view'
            }
          >
            how to distribute a resource
          </Link>{' '}
          through ASAP’s tool program.
        </>
      );
    case 'Article':
      return <>Share your preprint or published article on the Hub.</>;
    default:
      return null;
  }
};

type TeamCreateOutputHeaderProps = {
  documentType: ResearchOutputDocumentType;
};

const TeamCreateOutputHeader: React.FC<TeamCreateOutputHeaderProps> = ({
  documentType,
}) => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>{headerCopy(documentType)}</Display>
      <div>
        <Paragraph accent="lead">
          <SubheaderCopy outputDocumentType={documentType} />
        </Paragraph>
      </div>
    </div>
  </header>
);

export default TeamCreateOutputHeader;
