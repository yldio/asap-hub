import { ComponentProps } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, StaticRouter } from 'react-router-dom';

import ToolModal from '../ToolModal';

const props: ComponentProps<typeof ToolModal> = {
  backHref: '/wrong',
  title: 'Title',
  name: 'Tool',
  description: 'Description',
  url: 'https://example.com/tool',
};
it('renders the title', () => {
  const { getByText } = render(<ToolModal {...props} title="ModalTitle" />, {
    wrapper: StaticRouter,
  });
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
    { wrapper: StaticRouter },
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

it('allows url with http protocol', () => {
  const { getAllByRole } = render(
    <ToolModal {...props} url="http://example.com/tool" />,
    { wrapper: StaticRouter },
  );

  expect(getAllByRole('textbox')[0]).toBeValid();
});

it('allows url with https protocol', () => {
  const { getAllByRole } = render(
    <ToolModal {...props} url="https://example.com/tool" />,
    { wrapper: StaticRouter },
  );

  expect(getAllByRole('textbox')[0]).toBeValid();
});

it('does not allow any other uri scheme', () => {
  const { getAllByRole } = render(
    <ToolModal {...props} url="slack://example" />,
    { wrapper: StaticRouter },
  );

  expect(getAllByRole('textbox')[0]).toBeInvalid();
});

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <ToolModal
      {...props}
      name="toolName"
      url="http://example.com"
      description="toolDescription"
      onSave={jestFn}
    />,
    { wrapper: MemoryRouter },
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
  const { getByText } = render(<ToolModal {...props} onSave={handleSave} />, {
    wrapper: StaticRouter,
  });

  userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
