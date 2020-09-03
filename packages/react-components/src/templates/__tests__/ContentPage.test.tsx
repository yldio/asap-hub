import React from 'react';
import { render } from '@testing-library/react';

import ContentPage from '../ContentPage';

const boilerplateProps = {
  text: '<h1>h1</h1>',
  path: '/',
  title: 'title',
};

it('renders the content and the title', () => {
  const { getByText } = render(<ContentPage {...boilerplateProps} />);

  expect(getByText('title')).toBeVisible();
  expect(getByText('title').tagName).toEqual('H1');
  expect(getByText('h1', { selector: 'h2' })).toBeVisible();
});
