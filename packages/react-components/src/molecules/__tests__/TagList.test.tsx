import React from 'react';
import { render } from '@testing-library/react';

import TagList from '../TagList';

it('shows all skills when there are few', () => {
  const { getAllByRole } = render(
    <TagList
      summarize
      tags={['Neurological Diseases', 'Clinical Neurology']}
    />,
  );
  expect(
    getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toEqual(['Neurological Diseases', 'Clinical Neurology']);
});

it('shows all tags when not summarized', () => {
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

it('shows only the first skills when there are many', () => {
  const { getAllByRole } = render(
    <TagList
      summarize
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
  ).toEqual(['Neurological Diseases', 'Clinical Neurology', 'Adult Neurology']);
});

it('hides skills when there are none', () => {
  const { queryAllByRole } = render(<TagList tags={[]} />);
  expect(queryAllByRole('list')).toEqual([]);
});
