import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';

import AdditionalMaterials from '../AdditionalMaterials';

const props: ComponentProps<typeof AdditionalMaterials> = {
  ...createEventResponse(),
};

it('renders a meeting material', () => {
  const { getByRole } = render(
    <AdditionalMaterials
      {...props}
      meetingMaterials={[{ title: 'test', url: 'http://example.com' }]}
    />,
  );
  expect(getByRole('heading', { level: 3 }).textContent).toEqual('test');
  expect(getByRole('link')).toHaveAttribute('href', 'http://example.com');
});

it('renders multiple meeting materials', () => {
  const { getAllByRole } = render(
    <AdditionalMaterials
      {...props}
      meetingMaterials={[
        { title: 'test', url: 'http://example.com' },
        { title: 'test2', url: 'http://example.com' },
      ]}
    />,
  );
  expect(
    getAllByRole('heading', { level: 3 }).map(({ textContent }) => textContent),
  ).toEqual(['test', 'test2']);
});

it('Does not render when meeting materials is empty', () => {
  const { queryByRole } = render(
    <AdditionalMaterials {...props} meetingMaterials={[]} />,
  );
  expect(queryByRole('heading')).not.toBeInTheDocument();
});

it('Does not render when additional materials is null', () => {
  const { queryByRole } = render(
    <AdditionalMaterials {...props} meetingMaterials={null} />,
  );
  expect(queryByRole('heading')).not.toBeInTheDocument();
});
