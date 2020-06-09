import React from 'react';
import { render } from '@testing-library/react';

import Label from '../Label';
import { noop } from '../../utils';

it('renders the text in a <label>', () => {
  const { getByLabelText } = render(
    <Label>
      text
      <input type="text" value="val" onChange={noop} />
    </Label>,
  );
  expect(getByLabelText('text')).toHaveValue('val');
});
