import {
  ResearchOutputDocumentType,
  ResearchOutputEntityType,
} from '@asap-hub/model';
import { render, screen } from '@testing-library/react';

import ResearchOutputHeader from '../ResearchOutputHeader';

it.each<{
  documentType: ResearchOutputDocumentType;
  entityType: ResearchOutputEntityType;
  headingName: RegExp;
  subHeader: RegExp;
}>([
  {
    documentType: 'Article',
    entityType: 'team',
    headingName: /Share a Team Article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Protocol',
    entityType: 'team',
    headingName: /Share a Team Protocol/i,
    subHeader: /Add your protocol/,
  },
  {
    documentType: 'Dataset',
    entityType: 'team',
    headingName: /Share a Team Dataset/i,
    subHeader: /Add your dataset/,
  },
  {
    documentType: 'Bioinformatics',
    entityType: 'team',
    headingName: /Share Team Bioinformatics/i,
    subHeader: /Add bioinformatics/,
  },
  {
    documentType: 'Lab Material',
    entityType: 'team',
    headingName: /Share a Team Lab Material/i,
    subHeader: /Add your lab material/,
  },
  {
    documentType: 'Article',
    entityType: 'working-group',
    headingName: /Share a Working Group Article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Report',
    entityType: 'working-group',
    headingName: /Share a Working Group CRN Report/i,
    subHeader: /add your CRN report/,
  },
])(
  'renders the $documentType $entityType research output',
  ({ documentType, headingName, subHeader, entityType }) => {
    render(
      <ResearchOutputHeader
        entityType={entityType}
        documentType={documentType}
      />,
    );
    expect(
      screen.getByRole('heading', { name: headingName }),
    ).toBeInTheDocument();
    expect(screen.getByText(subHeader)).toBeInTheDocument();
  },
);
