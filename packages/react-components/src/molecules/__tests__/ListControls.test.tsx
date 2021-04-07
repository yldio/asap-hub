import React from 'react';
import { render } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom';

import ListControls from '../ListControls';

it('passes through links', () => {
  const { getByTitle } = render(
    <ListControls
      detailsViewHref="/details?123"
      listViewHref="/list?321"
      listView={false}
    />,
    { wrapper: StaticRouter },
  );
  expect(getByTitle(/list/i).closest('a')).toHaveAttribute('href', '/list?321');
  expect(getByTitle(/detail/i).closest('a')).toHaveAttribute(
    'href',
    '/details?123',
  );
});
