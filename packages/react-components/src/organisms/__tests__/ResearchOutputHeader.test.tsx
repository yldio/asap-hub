import {
  ResearchOutputDocumentType,
  ResearchOutputPublishingEntities,
} from '@asap-hub/model';
import { render, screen } from '@testing-library/react';

import ResearchOutputHeader from '../ResearchOutputHeader';

it.each<{
  documentType: ResearchOutputDocumentType;
  publishingEntity: ResearchOutputPublishingEntities;
  headingName: RegExp;
  subHeader: RegExp;
}>([
  {
    documentType: 'Article',
    publishingEntity: 'Team',
    headingName: /Share an article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Protocol',
    publishingEntity: 'Team',
    headingName: /Share a protocol/i,
    subHeader: /Add your protocol/,
  },
  {
    documentType: 'Dataset',
    publishingEntity: 'Team',
    headingName: /Share a dataset/i,
    subHeader: /Add your dataset/,
  },
  {
    documentType: 'Bioinformatics',
    publishingEntity: 'Team',
    headingName: /Share bioinformatics/i,
    subHeader: /Add bioinformatics/,
  },
  {
    documentType: 'Lab Resource',
    publishingEntity: 'Team',
    headingName: /Share a lab resource/i,
    subHeader: /Add your lab resource/,
  },
  {
    documentType: 'Article',
    publishingEntity: 'Working Group',
    headingName: /Share a Working Group Article/i,
    subHeader: /published article/,
  },
  {
    documentType: 'Report',
    publishingEntity: 'Working Group',
    headingName: /Share a Working Group CRN Report/i,
    subHeader: /add your CRN report/,
  },
])(
  'renders the $documentType $publishingEntity research output',
  ({ documentType, headingName, subHeader, publishingEntity }) => {
    render(
      <ResearchOutputHeader
        publishingEntity={publishingEntity}
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
    <ResearchOutputHeader
      publishingEntity="Team"
      documentType="Presentation"
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share a resource/i }),
  ).toBeInTheDocument();
});

it('falls back to a generic description for working groups', () => {
  render(
    <ResearchOutputHeader
      documentType="Presentation"
      publishingEntity="Working Group"
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share a working group resource/i }),
  ).toBeInTheDocument();
});
