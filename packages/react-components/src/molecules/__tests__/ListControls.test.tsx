import React from 'react';
import { render } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom';

import ListControls from '../ListControls';

it('passes through links', () => {
  const { getByTitle } = render(
    <ListControls
      cardViewHref="/card?123"
      listViewHref="/list?321"
      listView={false}
    />,
    { wrapper: StaticRouter },
  );
  expect(getByTitle(/list/i).closest('a')).toHaveAttribute('href', '/list?321');
  expect(getByTitle(/card/i).closest('a')).toHaveAttribute('href', '/card?123');
});
