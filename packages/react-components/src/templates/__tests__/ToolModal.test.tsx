import { ComponentProps } from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import ToolModal from '../ToolModal';

const props: ComponentProps<typeof ToolModal> = {
  backHref: '/wrong',
  title: 'Title',
  name: 'Tool',
  description: 'Description',
  url: 'https://example.com/tool',
};
it('renders the title', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal {...props} title="ModalTitle" />
    </MemoryRouter>,
  );
  expect(getByText('ModalTitle', { selector: 'h3' })).toBeVisible();
});

it('indicates which fields are required or optional', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal {...props} title="ModalTitle" />
    </MemoryRouter>,
  );

  [
    { title: 'Add URL', subtitle: 'required' },
    { title: 'Tool Name', subtitle: 'required' },
    { title: 'Description', subtitle: 'optional' },
  ].forEach(({ title, subtitle }) =>
    expect(getByText(title).nextSibling?.textContent).toContain(subtitle),
  );
});

it('renders default values into inputs', () => {
  const { queryAllByRole } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal
        {...props}
        name="LinkName"
        description="LinkDescription"
        url="http://example.com"
      />
    </MemoryRouter>,
  );
  expect(queryAllByRole('textbox').map((input) => input.getAttribute('value')))
    .toMatchInlineSnapshot(`
    [
      "http://example.com",
      "LinkName",
      "LinkDescription",
    ]
  `);
});

it('allows url with https protocol', () => {
  const { getByLabelText, queryByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal {...props} />
    </MemoryRouter>,
    {},
  );
  const inputUrl = getByLabelText(/Add URL/i);

  expect(inputUrl).toBeValid();
  expect(
    queryByText('Please enter a valid URL, starting with http:// or https://'),
  ).toBeNull();
});
it('allows url with http protocol', () => {
  const { getByLabelText, queryByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal {...props} />
    </MemoryRouter>,
    {},
  );

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

it('does not allow any other uri scheme', async () => {
  const { getByLabelText, findByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal {...props} />
    </MemoryRouter>,
  );
  const inputUrl = getByLabelText(/Add URL/i);

  await userEvent.clear(inputUrl);
  await userEvent.type(inputUrl, 'slack://tool');
  await userEvent.tab(); // Trigger blur event

  // Wait for validation error message to appear (this ensures state update completes)
  await waitFor(async () => {
    const errorMessage = await findByText(
      'Please enter a valid URL, starting with http:// or https://',
    );
    expect(errorMessage).toBeVisible();
  });

  expect(inputUrl).toBeInvalid();
});

it('triggers the save function', async () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal
        {...props}
        name="toolName"
        url="http://example.com"
        description="toolDescription"
        onSave={jestFn}
      />
    </MemoryRouter>,
  );

  await userEvent.click(getByText(/save/i));
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
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal {...props} onSave={handleSave} />
    </MemoryRouter>,
  );

  await userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it('renders name field before url field when nameFirst is true', () => {
  const { queryAllByRole } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal
        {...props}
        nameFirst
        name="LinkName"
        url="http://example.com"
        description="LinkDescription"
      />
    </MemoryRouter>,
  );
  expect(queryAllByRole('textbox').map((input) => input.getAttribute('value')))
    .toMatchInlineSnapshot(`
    [
      "LinkName",
      "http://example.com",
      "LinkDescription",
    ]
  `);
});

it('renders custom url title and descriptions', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal
        {...props}
        urlTitle="Custom URL"
        urlDescription="Custom url desc"
        descriptionDescription="Custom desc desc"
      />
    </MemoryRouter>,
  );
  expect(getByText('Custom URL')).toBeVisible();
  expect(getByText('Custom url desc')).toBeVisible();
  expect(getByText('Custom desc desc')).toBeVisible();
});

it('renders bottom buttons when saveButtonText is provided', () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal {...props} saveButtonText="Add Tool" backHref="/back" />
    </MemoryRouter>,
  );
  expect(getByText('Add Tool')).toBeVisible();
  expect(getByText('Cancel')).toBeVisible();
  expect(getByText('Cancel').closest('a')).toHaveAttribute('href', '/back');
});

it('triggers save via bottom button when saveButtonText is provided', async () => {
  const jestFn = jest.fn();
  const { getByText } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal
        {...props}
        name="toolName"
        url="http://example.com"
        description="toolDescription"
        onSave={jestFn}
        saveButtonText="Add Tool"
      />
    </MemoryRouter>,
  );

  await userEvent.click(getByText('Add Tool'));
  expect(jestFn).toHaveBeenCalledWith({
    name: 'toolName',
    url: 'http://example.com',
    description: 'toolDescription',
  });
});

it('disables bottom buttons and shows spinner while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText, container } = render(
    <MemoryRouter initialEntries={['/']}>
      <ToolModal {...props} onSave={handleSave} saveButtonText="Add Tool" />
    </MemoryRouter>,
  );

  await userEvent.click(getByText('Add Tool'));

  expect(getByText('Add Tool').closest('button')).toBeDisabled();
  expect(
    container.querySelector('[class*="spinnerStyles"]'),
  ).toBeInTheDocument();

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText('Add Tool').closest('button')).toBeEnabled(),
  );
});
