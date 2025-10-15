import React, { ReactNode } from 'react';
import { css } from '@emotion/react';
import { ResearchOutputDocumentType } from '@asap-hub/model';

import { news } from '@asap-hub/routing';
import { Display, Link, Paragraph } from '../atoms';
import { rem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const headerStyles = css({
  padding: `${rem(36)} ${contentSidePaddingWithNavigation(8)} ${rem(60)}`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: rem(30),
  display: 'flex',
  justifyContent: 'center',
});

const contentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: rem(800),
  width: '100%',
  justifyContent: 'center',
});

const subheaderRecord: Record<ResearchOutputDocumentType, ReactNode | null> = {
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
  'Lab Material': (
    <>
      Add your lab material to a repository (e.g. Addgene or WiCell) before
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
  'Grant Document': null,
  Presentation: null,
};

const headerTextMap: Record<
  'Team' | 'WorkingGroup',
  Record<ResearchOutputDocumentType, string>
> = {
  WorkingGroup: {
    Article: 'Share a Working Group Article',
    Bioinformatics: 'Share Working Group Bioinformatics',
    Dataset: 'Share a Working Group Dataset',
    Protocol: 'Share a Working Group Protocol',
    'Lab Material': 'Share a Working Group Lab Material',
    Report: 'Share a Working Group CRN Report',
    'Grant Document': 'Share a Working Group Grant Document',
    Presentation: 'Share a Working Group Presentation',
  },
  Team: {
    Protocol: 'Share a Team Protocol',
    Dataset: 'Share a Team Dataset',
    Bioinformatics: 'Share Team Bioinformatics',
    'Lab Material': 'Share a Team Lab Material',
    Article: 'Share a Team Article',
    'Grant Document': 'Share a Team Grant Document',
    Presentation: 'Share a Team Presentation',
    Report: 'Share a Team Report',
  },
};

type ResearchOutputHeaderProps = {
  documentType: ResearchOutputDocumentType;
  workingGroupAssociation: boolean;
};

const ResearchOutputHeader: React.FC<ResearchOutputHeaderProps> = ({
  documentType,
  workingGroupAssociation,
}) => (
  <header css={headerStyles}>
    <div css={contentStyles}>
      <Display styleAsHeading={2}>
        {
          headerTextMap[workingGroupAssociation ? 'WorkingGroup' : 'Team'][
            documentType
          ]
        }
      </Display>
      <div>
        {subheaderRecord[documentType] && (
          <Paragraph noMargin accent="lead">
            {subheaderRecord[documentType]}
          </Paragraph>
        )}
      </div>
    </div>
  </header>
);

export default ResearchOutputHeader;
