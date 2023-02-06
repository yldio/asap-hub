import React, { ReactNode } from 'react';
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

const excludedTypes = ['Grant Document', 'Presentation'];

type subHeaderTypes = Exclude<
  ResearchOutputDocumentType,
  'Grant Document' | 'Presentation'
>;

type subHeaderRecordType = {
  [key in subHeaderTypes]: ReactNode;
};

const subheaderRecord: subHeaderRecordType = {
  Protocol: (
    <>
      Add your protocol to a repository (e.g. protocols.io) before sharing on
      the Hub. Find out{' '}
      <Link
        href={
          news({}).article({
            articleId: '7d3dd1ec-14ef-441c-8a2c-19a23d6264f3',
          }).$
        }
      >
        how to add to protocols.io
      </Link>{' '}
      to get started.
    </>
  ),
  Dataset: (
    <>
      Add your dataset to a platform (e.g. Zenodo) before sharing on the Hub.
      Find out{' '}
      <Link
        href={
          news({}).article({
            articleId: '735944ac-5641-431f-8984-bf53972dfd4e',
          }).$
        }
      >
        how to add to Zenodo
      </Link>{' '}
      to get started.
    </>
  ),
  Bioinformatics: (
    <>
      Add bioinformatics, such as scripts or software, to a platform (e.g.
      Github) before sharing on the Hub.
    </>
  ),
  'Lab Resource': (
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
  ),
  Article: <>Share your preprint or published article on the Hub.</>,
  Report: (
    <>
      If possible, please add your CRN report (for example, survey and table
      summaries, CRN guidelines, etc.) to the working group google folder before
      sharing on the Hub.
    </>
  ),
};

const headerCopy = (
  outputDocumentType: ResearchOutputDocumentType,
  teamAssociation: boolean,
) => {
  if (teamAssociation) {
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
  }
  switch (outputDocumentType) {
    case 'Article':
      return 'Share a Working Group Article';
    case 'Report':
      return 'Share a Working Group CRN Report';
    default:
      return 'Share a Working Group Resource';
  }
};

type ResearchOutputHeaderProps = {
  documentType: ResearchOutputDocumentType;
  teamAssociation?: boolean;
};

const ResearchOutputHeader: React.FC<ResearchOutputHeaderProps> = ({
  documentType,
  teamAssociation = false,
}) => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>
        {headerCopy(documentType, teamAssociation)}
      </Display>
      <div>
        <Paragraph accent="lead">
          {excludedTypes.includes(documentType)
            ? null
            : subheaderRecord[documentType as subHeaderTypes]}
        </Paragraph>
      </div>
    </div>
  </header>
);

export default ResearchOutputHeader;
