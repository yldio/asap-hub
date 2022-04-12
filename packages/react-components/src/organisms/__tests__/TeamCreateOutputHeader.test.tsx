import { useFlags } from '@asap-hub/react-context';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import TeamCreateOutputHeader from '../TeamCreateOutputHeader';

beforeEach(() => {
  const {
    result: {
      current: { disable },
    },
  } = renderHook(useFlags);

  disable('ROMS_FORM');
});

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
    render(<TeamCreateOutputHeader documentType={documentType} />);
    expect(
      screen.getByRole('heading', { name: headingName }),
    ).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  },
);

it('falls back to a generic description otherwise', () => {
  render(<TeamCreateOutputHeader documentType="Presentation" />);
  expect(
    screen.getByRole('heading', { name: /Share a resource/i }),
  ).toBeInTheDocument();
});
