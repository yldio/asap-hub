import React, { ComponentProps } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ToolModal from '../ToolModal';

const props: ComponentProps<typeof ToolModal> = {
  backHref: '/wrong',
  title: 'Title',
  name: 'Tool',
  description: 'Description',
  url: 'https://example.com/tool',
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

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <MemoryRouter>
      <ToolModal
        {...props}
        name="toolName"
        url="http://example.com"
        description="toolDescription"
        onSave={jestFn}
      />
      ,
    </MemoryRouter>,
  );

  userEvent.click(getByText(/save/i));
  expect(jestFn).toHaveBeenCalledWith({
    name: 'toolName',
    url: 'http://example.com',
    description: 'toolDescription',
  });

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(<ToolModal {...props} onSave={handleSave} />);

  userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
