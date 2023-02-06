import {
  ResearchOutputAssociation,
  ResearchOutputDocumentType,
} from '@asap-hub/model';
import { render, screen } from '@testing-library/react';

import ResearchOutputHeader from '../ResearchOutputHeader';

it.each<{
  documentType: ResearchOutputDocumentType;
  association: ResearchOutputAssociation;
  headingName: RegExp;
  subHeader: RegExp;
}>([
  {
    documentType: 'Article',
    association: 'Team',
    headingName: /Share an article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Protocol',
    association: 'Team',
    headingName: /Share a protocol/i,
    subHeader: /Add your protocol/,
  },
  {
    documentType: 'Dataset',
    association: 'Team',
    headingName: /Share a dataset/i,
    subHeader: /Add your dataset/,
  },
  {
    documentType: 'Bioinformatics',
    association: 'Team',
    headingName: /Share bioinformatics/i,
    subHeader: /Add bioinformatics/,
  },
  {
    documentType: 'Lab Resource',
    association: 'Team',
    headingName: /Share a lab resource/i,
    subHeader: /Add your lab resource/,
  },
  {
    documentType: 'Article',
    association: 'Working Group',
    headingName: /Share a Working Group Article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Report',
    association: 'Working Group',
    headingName: /Share a Working Group CRN Report/i,
    subHeader: /add your CRN report/,
  },
])(
  'renders the $documentType $association research output',
  ({ documentType, headingName, subHeader, association }) => {
    render(
      <ResearchOutputHeader
        association={association}
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
  render(
    <ResearchOutputHeader association="Team" documentType="Presentation" />,
  );
  expect(
    screen.getByRole('heading', { name: /Share a resource/i }),
  ).toBeInTheDocument();
});

it('falls back to a generic description for working groups', () => {
  render(
    <ResearchOutputHeader
      documentType="Presentation"
      association="Working Group"
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share a working group resource/i }),
  ).toBeInTheDocument();
});
