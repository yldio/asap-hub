import React from 'react';
import { render } from '@testing-library/react';

import TagList from '../TagList';

it('shows all tags by default', () => {
  const { getAllByRole } = render(
    <TagList
      tags={[
        'Neurological Diseases',
        'Clinical Neurology',
        'Adult Neurology',
        'Neuroimaging',
      ]}
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual([
    'Neurological Diseases',
    'Clinical Neurology',
    'Adult Neurology',
    'Neuroimaging',
  ]);
});

it('hides tags when there are none', () => {
  const { queryAllByRole } = render(<TagList tags={[]} />);
  expect(queryAllByRole('list')).toEqual([]);
});

describe('when capped', () => {
  it('shows all tags when there are fewer than the cap', () => {
    const { getAllByRole } = render(
      <TagList
        min={3}
        max={3}
        tags={['Neurological Diseases', 'Clinical Neurology']}
      />,
    );
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual(['Neurological Diseases', 'Clinical Neurology']);
  });

  it('shows only the first tags when there are too many', () => {
    const { getAllByRole } = render(
      <TagList
        min={3}
        max={3}
        tags={[
          'Neurological Diseases',
          'Clinical Neurology',
          'Adult Neurology',
          'Neuroimaging',
          'A53T',
          'alpha-synuclein interactions',
          'alpha-synuclein',
          'autophagy',
        ]}
      />,
    );
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      'Neurological Diseases',
      'Clinical Neurology',
      'Adult Neurology',
    ]);
  });
});
