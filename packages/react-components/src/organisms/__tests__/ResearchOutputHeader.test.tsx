import { render, screen } from '@testing-library/react';

import ResearchOutputHeader from '../ResearchOutputHeader';

it.each([
  {
    documentType: 'Article',
    headingName: /Share an article/i,
    text: /published article/,
  },
  {
    documentType: 'Protocol',
    headingName: /Share a protocol/i,
    text: /Add your protocol/,
  },
  {
    documentType: 'Dataset',
    headingName: /Share a dataset/i,
    text: /Add your dataset/,
  },
  {
    documentType: 'Bioinformatics',
    headingName: /Share bioinformatics/i,
    text: /Add bioinformatics/,
  },
  {
    documentType: 'Lab Resource',
    headingName: /Share a lab resource/i,
    text: /Add your lab resource/,
  },
] as const)(
  'renders the $documentType research output',
  ({ documentType, headingName, text }) => {
    render(<ResearchOutputHeader documentType={documentType} />);
    expect(
      screen.getByRole('heading', { name: headingName }),
    ).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  },
);

it.each([
  {
    documentType: 'Article',
    headingName: /Share a Working Group Article/i,
    text: /published article/,
  },
] as const)(
  'renders the $documentType research output for a working group publishing entity',
  ({ documentType, headingName, text }) => {
    render(
      <ResearchOutputHeader
        documentType={documentType}
        publishingEntity={'Working Group'}
      />,
    );
    expect(
      screen.getByRole('heading', { name: headingName }),
    ).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  },
);

it('falls back to a generic description otherwise', () => {
  render(<ResearchOutputHeader documentType="Presentation" />);
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
