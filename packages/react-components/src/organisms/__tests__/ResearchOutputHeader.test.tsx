import { ResearchOutputDocumentType } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';

import ResearchOutputHeader from '../ResearchOutputHeader';

it.each<{
  documentType: ResearchOutputDocumentType;
  teamAssociation: boolean;
  headingName: RegExp;
  subHeader: RegExp;
}>([
  {
    documentType: 'Article',
    teamAssociation: true,
    headingName: /Share an article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Protocol',
    teamAssociation: true,
    headingName: /Share a protocol/i,
    subHeader: /Add your protocol/,
  },
  {
    documentType: 'Dataset',
    teamAssociation: true,
    headingName: /Share a dataset/i,
    subHeader: /Add your dataset/,
  },
  {
    documentType: 'Bioinformatics',
    teamAssociation: true,
    headingName: /Share bioinformatics/i,
    subHeader: /Add bioinformatics/,
  },
  {
    documentType: 'Lab Resource',
    teamAssociation: true,
    headingName: /Share a lab resource/i,
    subHeader: /Add your lab resource/,
  },
  {
    documentType: 'Article',
    teamAssociation: false,
    headingName: /Share a Working Group Article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Report',
    teamAssociation: false,
    headingName: /Share a Working Group CRN Report/i,
    subHeader: /add your CRN report/,
  },
])(
  'renders the $documentType $association research output',
  ({ documentType, headingName, subHeader, teamAssociation }) => {
    render(
      <ResearchOutputHeader
        teamAssociation={teamAssociation}
        documentType={documentType}
      />,
    );
    expect(
      screen.getByRole('heading', { name: headingName }),
    ).toBeInTheDocument();
    expect(screen.getByText(subHeader)).toBeInTheDocument();
  },
);

it('falls back to a generic description otherwise', () => {
  render(<ResearchOutputHeader documentType="Presentation" teamAssociation />);
  expect(
    screen.getByRole('heading', { name: /Share a resource/i }),
  ).toBeInTheDocument();
});

it('falls back to a generic description for working groups', () => {
  render(<ResearchOutputHeader documentType="Presentation" />);
  expect(
    screen.getByRole('heading', { name: /Share a working group resource/i }),
  ).toBeInTheDocument();
});
