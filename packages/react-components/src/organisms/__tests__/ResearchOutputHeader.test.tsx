import { ResearchOutputDocumentType } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';

import ResearchOutputHeader from '../ResearchOutputHeader';

it.each<{
  documentType: ResearchOutputDocumentType;
  workingGroupAssociation: boolean;
  headingName: RegExp;
  subHeader: RegExp;
}>([
  {
    documentType: 'Article',
    workingGroupAssociation: false,
    headingName: /Share an article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Protocol',
    workingGroupAssociation: false,
    headingName: /Share a protocol/i,
    subHeader: /Add your protocol/,
  },
  {
    documentType: 'Dataset',
    workingGroupAssociation: false,
    headingName: /Share a dataset/i,
    subHeader: /Add your dataset/,
  },
  {
    documentType: 'Bioinformatics',
    workingGroupAssociation: false,
    headingName: /Share bioinformatics/i,
    subHeader: /Add bioinformatics/,
  },
  {
    documentType: 'Lab Resource',
    workingGroupAssociation: false,
    headingName: /Share a lab resource/i,
    subHeader: /Add your lab resource/,
  },
  {
    documentType: 'Article',
    workingGroupAssociation: true,
    headingName: /Share a Working Group Article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Report',
    workingGroupAssociation: true,
    headingName: /Share a Working Group CRN Report/i,
    subHeader: /add your CRN report/,
  },
])(
  'renders the $documentType $association research output',
  ({ documentType, headingName, subHeader, workingGroupAssociation }) => {
    render(
      <ResearchOutputHeader
        workingGroupAssociation={workingGroupAssociation}
        documentType={documentType}
      />,
    );
    expect(
      screen.getByRole('heading', { name: headingName }),
    ).toBeInTheDocument();
    expect(screen.getByText(subHeader)).toBeInTheDocument();
  },
);
