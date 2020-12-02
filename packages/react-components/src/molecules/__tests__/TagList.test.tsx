import React from 'react';
import { render } from '@testing-library/react';

import TagList from '../TagList';

describe('Summarized', () => {
  it('shows all tags when there are few', () => {
    const { getAllByRole } = render(
      <TagList
        summarize
        tags={['Neurological Diseases', 'Clinical Neurology'].map((label) => ({
          label,
        }))}
      />,
    );
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual(['Neurological Diseases', 'Clinical Neurology']);
  });

  it('shows only the first tags when there are many', () => {
    const { getAllByRole } = render(
      <TagList
        summarize
        tags={[
          'Neurological Diseases',
          'Clinical Neurology',
          'Adult Neurology',
          'Neuroimaging',
          'A53T',
          'alpha-synuclein interactions',
          'alpha-synuclein',
          'autophagy',
        ].map((label) => ({ label }))}
      />,
    );
    expect(
      getAllByRole('listitem').map(({ textContent }) => textContent),
    ).toEqual([
      'Neurological Diseases',
      'Clinical Neurology',
      'Adult Neurology',
      'Neuroimaging',
      'A53T',
    ]);
  });
});

describe('Full tag list', () => {
  it('shows all tags when not summarized', () => {
    const { getAllByRole } = render(
      <TagList
        tags={[
          'Neurological Diseases',
          'Clinical Neurology',
          'Adult Neurology',
          'Neuroimaging',
        ].map((label) => ({ label }))}
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
});
