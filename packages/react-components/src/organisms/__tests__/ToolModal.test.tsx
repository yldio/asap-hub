import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ToolModal from '../ToolModal';

const props: ComponentProps<typeof ToolModal> = {
  backHref: '/wrong',
  title: '',
};
it('renders the title', () => {
  const { getByText } = render(<ToolModal {...props} title="ModalTitle" />);
  expect(getByText('ModalTitle', { selector: 'h3' })).toBeVisible();
});

it('renders default values into inputs', () => {
  const { queryAllByRole } = render(
    <ToolModal
      {...props}
      name="LinkName"
      description="LinkDescription"
      url="http://example.com"
    />,
  );
  expect(queryAllByRole('textbox').map((input) => input.getAttribute('value')))
    .toMatchInlineSnapshot(`
    Array [
      "http://example.com",
      "LinkName",
      "LinkDescription",
    ]
  `);
});

it('triggers the save function', () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <ToolModal {...props} title="ModalTitle" onSave={jestFn} />,
  );
  userEvent.click(getByText('Save'));
  expect(jestFn).toHaveBeenCalled();
});
