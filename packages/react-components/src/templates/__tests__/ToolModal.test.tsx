import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
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

it('indicates which fields are required or optional', () => {
  const { getByText } = render(<ToolModal {...props} title="ModalTitle" />, {
    wrapper: StaticRouter,
  });

  [
    { title: 'Add URL', subtitle: 'Required' },
    { title: 'Tool Name', subtitle: 'Required' },
    { title: 'Description', subtitle: 'Optional' },
  ].forEach(({ title, subtitle }) =>
    expect(getByText(title).nextSibling?.textContent).toContain(subtitle),
  );
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

it('allows url with https protocol', () => {
  const { getByLabelText, queryByText } = render(<ToolModal {...props} />, {
    wrapper: StaticRouter,
  });
  const inputUrl = getByLabelText(/Add URL/i);

  expect(inputUrl).toBeValid();
  expect(
    queryByText('Please enter a valid URL, starting with http:// or https://'),
  ).toBeNull();
});
it('allows url with http protocol', () => {
  const { getByLabelText, queryByText } = render(<ToolModal {...props} />, {
    wrapper: StaticRouter,
  });

  const inputUrl = getByLabelText(/Add URL/i);

  fireEvent.change(inputUrl, {
    target: { value: 'http://example.com/tool' },
  });
  fireEvent.focusOut(inputUrl);

  expect(inputUrl).toBeValid();
  expect(
    queryByText('Please enter a valid URL, starting with http:// or https://'),
  ).toBeNull();
});

it('does not allow any other uri scheme', () => {
  const { getByLabelText, queryByText } = render(<ToolModal {...props} />, {
    wrapper: StaticRouter,
  });
  const inputUrl = getByLabelText(/Add URL/i);
  fireEvent.change(inputUrl, {
    target: { value: 'slack://tool' },
  });
  fireEvent.focusOut(inputUrl);

  expect(inputUrl).toBeInvalid();
  expect(
    queryByText('Please enter a valid URL, starting with http:// or https://'),
  ).toBeVisible();
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
