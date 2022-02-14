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
    type: 'Article',
    headingName: /Share an article/i,
    text: /published article/,
  },
  {
    type: 'Protocol',
    headingName: /Share a protocol/i,
    text: /Add your protocol/,
  },
  {
    type: 'Dataset',
    headingName: /Share a dataset/i,
    text: /Add your dataset/,
  },
  {
    type: 'Bioinformatics',
    headingName: /Share bioinformatics/i,
    text: /Add bioinformatics/,
  },
  {
    type: 'Lab Resource',
    headingName: /Share a lab resource/i,
    text: /Add your lab resource/,
  },
] as const)(
  'renders the $type research output',
  ({ type, headingName, text }) => {
    render(<TeamCreateOutputHeader type={type} />);
    expect(
      screen.getByRole('heading', { name: headingName }),
    ).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  },
);

it('falls back to a generic description otherwise', () => {
  render(<TeamCreateOutputHeader type="Presentation" />);
  expect(
    screen.getByRole('heading', { name: /Share a resource/i }),
  ).toBeInTheDocument();
});
