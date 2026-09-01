import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { render, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServerValidationError, UserResponse } from '@asap-hub/model';

import ContactInfoModal, { invalidEmailMessage } from '../ContactInfoModal';
import { NavigationBlockerProvider } from '../../navigation';
import { rem } from '../../pixels';
import { mockActErrorsInConsole } from '../../test-utils';

const renderModal = (children: ReactNode) =>
  render(<MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>);
it('renders a form to edit the contact info', () => {
  const { getByText } = renderModal(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
  );
  expect(getByText(/contact/i, { selector: 'h3' })).toBeVisible();
});

it('indicates which fields are optional', () => {
  const { getByText } = renderModal(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
  );

  [
    { title: 'Contact email', subtitle: 'optional' },
    { title: 'Personal Email', subtitle: 'optional' },
    { title: 'Website 1', subtitle: 'optional' },
    { title: 'Website 2', subtitle: 'optional' },
    { title: 'Researcher ID', subtitle: 'optional' },
    { title: 'X', subtitle: 'optional' },
    { title: 'BlueSky', subtitle: 'optional' },
    { title: 'Github', subtitle: 'optional' },
    { title: 'LinkedIn', subtitle: 'optional' },
    { title: 'Research Gate', subtitle: 'optional' },
    { title: 'Google Scholar', subtitle: 'optional' },
  ].forEach(({ title, subtitle }) =>
    expect(
      getByText(title, { selector: 'strong' }).nextSibling?.textContent,
    ).toContain(subtitle),
  );
});

it('shows the fallback email', () => {
  const { container } = renderModal(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
  );
  expect(container.textContent).toContain('fallback@example.com');
});

it('renders a text field containing the email', () => {
  const { getByLabelText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      email="contact@example.com"
      backHref="#"
    />,
  );
  expect(getByLabelText(/contact email/i)).toHaveValue('contact@example.com');
  expect(getByLabelText(/contact email/i)).toHaveAttribute(
    'placeholder',
    'Add a different email',
  );
});

it('renders a text field containing the personal email', () => {
  const { getByLabelText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      personalEmail="personal@example.com"
      backHref="#"
    />,
  );
  expect(getByLabelText(/personal email/i)).toHaveValue('personal@example.com');
  expect(getByLabelText(/personal email/i)).toHaveAttribute(
    'placeholder',
    'Add a personal email',
  );
});

it('fires onSave when submitting', async () => {
  const handleSave = jest.fn();
  const { getByLabelText, getByText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      backHref="#"
      onSave={handleSave}
    />,
  );

  await userEvent.clear(getByLabelText(/contact email/i));
  await userEvent.type(
    getByLabelText(/contact email/i),
    'new-contact@example.com',
  );
  await userEvent.click(getByText(/save/i));
  expect(handleSave).toHaveBeenLastCalledWith(
    expect.objectContaining({ contactEmail: 'new-contact@example.com' }),
  );

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
it('fires onSave with the personal email when submitting', async () => {
  const handleSave = jest.fn();
  const { getByLabelText, getByText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      backHref="#"
      onSave={handleSave}
    />,
  );

  await userEvent.type(
    getByLabelText(/personal email/i),
    'new-personal@example.com',
  );
  await userEvent.click(getByText(/save/i));
  expect(handleSave).toHaveBeenLastCalledWith(
    expect.objectContaining({ personalEmail: 'new-personal@example.com' }),
  );

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it('fires onSave with empty emails when they are cleared', async () => {
  const handleSave = jest.fn();
  const { getByLabelText, getByText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      email="contact@example.com"
      personalEmail="personal@example.com"
      backHref="#"
      onSave={handleSave}
    />,
  );

  await userEvent.clear(getByLabelText(/contact email/i));
  await userEvent.clear(getByLabelText(/personal email/i));
  await userEvent.click(getByText(/save/i));
  expect(handleSave).toHaveBeenLastCalledWith(
    expect.objectContaining({ contactEmail: '', personalEmail: '' }),
  );

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

it('does not fire onSave when the email is invalid', async () => {
  const handleSave = jest.fn();
  const { getByLabelText, getByText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      backHref="#"
      onSave={handleSave}
    />,
  );

  await userEvent.clear(getByLabelText(/contact email/i));
  await userEvent.type(getByLabelText(/contact email/i), '.');
  await userEvent.click(getByText(/save/i));
  expect(handleSave).not.toHaveBeenCalled();
});

// test@test satisfies the browser's own address check but not the content
// model, which requires a dot in the domain. It is the case this message
// exists for: without it the save reached Contentful and came back generic.
it.each(['Contact email', 'Personal Email'])(
  'explains why %s was refused by the content model',
  async (label) => {
    const { getByLabelText, getByText } = renderModal(
      <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
    );

    await userEvent.type(getByLabelText(new RegExp(label)), 'test@test');
    await userEvent.click(getByText(/save/i));

    expect(getByText(invalidEmailMessage)).toBeVisible();
  },
);

// The browser's own messages name the actual fault, so `pattern` must not
// swallow them by reporting everything as a generic malformed address.
it('leaves the browser to explain the faults it catches itself', async () => {
  const { getByLabelText, getByText, queryByText } = renderModal(
    <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
  );

  const field = getByLabelText(/contact email/i) as HTMLInputElement;
  await userEvent.type(field, 'not-an-email');
  await userEvent.click(getByText(/save/i));

  expect(field.validity.typeMismatch).toBe(true);
  expect(queryByText(invalidEmailMessage)).not.toBeInTheDocument();
});

// The API rejects what the browser cannot catch — a value that reached it from
// a stale client, or one Contentful's rule refuses for a reason the browser has
// no opinion on. Without this the user got only the generic toast.
it.each`
  label               | otherLabel          | instancePath
  ${'Contact email'}  | ${'Personal Email'} | ${'/contactEmail'}
  ${'Personal Email'} | ${'Contact email'}  | ${'/personalEmail'}
`(
  'shows the message on $label when the API rejects $instancePath',
  async ({ label, otherLabel, instancePath }) => {
    const consoleMock = mockActErrorsInConsole();
    const { getByLabelText, getByText, findByText, queryByText } = renderModal(
      <ContactInfoModal
        fallbackEmail="fallback@example.com"
        backHref="#"
        onSave={() =>
          Promise.reject(
            new ServerValidationError([
              {
                instancePath: instancePath as string,
                keyword: 'pattern',
                params: {},
                schemaPath: `#/properties${instancePath}/pattern`,
              },
            ]),
          )
        }
      />,
    );

    await userEvent.click(getByText(/save/i));

    expect(await findByText(invalidEmailMessage)).toBeVisible();
    const rejected = getByLabelText(new RegExp(label)) as HTMLInputElement;
    const other = getByLabelText(new RegExp(otherLabel)) as HTMLInputElement;
    expect(rejected.validationMessage).toBe(invalidEmailMessage);
    expect(other.validationMessage).toBe('');
    // The field message is the whole report; the toast would be a second,
    // vaguer message for the same problem.
    expect(queryByText(/unable to save your changes/i)).not.toBeInTheDocument();
    consoleMock.mockRestore();
  },
);

// A server error goes through setCustomValidity, and EditModal gates the whole
// save on reportValidity(). Without clearing on edit, the stale error on the
// first field blocks the save that would report the second.
it('lets the next save through after filling the other email', async () => {
  const consoleMock = mockActErrorsInConsole();
  const reject = (...paths: string[]) =>
    Promise.reject(
      new ServerValidationError(
        paths.map((instancePath) => ({
          instancePath,
          keyword: 'pattern',
          params: {},
          schemaPath: `#/properties${instancePath}/pattern`,
        })),
      ),
    );
  const onSave = jest
    .fn()
    .mockImplementationOnce(() => reject('/contactEmail'))
    .mockImplementationOnce(() => reject('/contactEmail', '/personalEmail'));

  const { getByLabelText, getByText, findByText, findAllByText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      backHref="#"
      onSave={onSave}
    />,
  );

  // Both values pass the client rule, so only the API can object to them.
  await userEvent.type(getByLabelText(/contact email/i), 'a@b.com');
  await userEvent.click(getByText(/save/i));
  expect(await findByText(invalidEmailMessage)).toBeVisible();

  await userEvent.type(getByLabelText(/personal email/i), 'a@b.com');
  await userEvent.click(getByText(/save/i));

  expect(onSave).toHaveBeenCalledTimes(2);
  expect(await findAllByText(invalidEmailMessage)).toHaveLength(2);
  consoleMock.mockRestore();
});

// Anything the modal cannot pin to a field has to keep the toast, or the save
// fails with no signal at all.
// EditModal only warns about unsaved changes when `dirty`, and a rejected email
// puts it back in the `initial` state — so a `dirty` that tracked only the
// emails would drop an unsaved website edit with no prompt.
it('still warns about an unsaved website after an email rejection', async () => {
  const consoleMock = mockActErrorsInConsole();
  const confirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
  const { getByLabelText, getByText, getByTitle } = render(
    <MemoryRouter initialEntries={['/']}>
      <NavigationBlockerProvider>
        <ContactInfoModal
          fallbackEmail="fallback@example.com"
          backHref="#"
          email="test@test"
          onSave={() =>
            Promise.reject(
              new ServerValidationError([
                {
                  instancePath: '/contactEmail',
                  keyword: 'pattern',
                  params: {},
                  schemaPath: '#/properties/contactEmail/pattern',
                },
              ]),
            )
          }
        />
      </NavigationBlockerProvider>
    </MemoryRouter>,
  );

  await userEvent.type(getByLabelText(/website 1/i), 'https://example.com');
  await userEvent.click(getByText(/save/i));
  await waitFor(() => expect(getByText(/save/i)).toBeEnabled());

  confirm.mockClear();
  await userEvent.click(getByTitle(/close/i));

  expect(confirm).toHaveBeenCalled();
  consoleMock.mockRestore();
  confirm.mockRestore();
});

// A rejection that is not a validation error at all — a network failure, say —
// must pass straight through to EditModal's generic report.
it('reports generically when the save fails for an unrelated reason', async () => {
  const consoleMock = mockActErrorsInConsole();
  const { getByText, findByText, queryByText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      backHref="#"
      onSave={() => Promise.reject(new Error('network down'))}
    />,
  );

  await userEvent.click(getByText(/save/i));

  expect(await findByText(/unable to save your changes/i)).toBeVisible();
  expect(queryByText(invalidEmailMessage)).not.toBeInTheDocument();
  consoleMock.mockRestore();
});

it('reports generically when the rejection names no field it can render', async () => {
  const consoleMock = mockActErrorsInConsole();
  const { getByText, findByText, queryByText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      backHref="#"
      onSave={() =>
        Promise.reject(
          new ServerValidationError([
            {
              instancePath: '/jobTitle',
              keyword: 'pattern',
              params: {},
              schemaPath: '#/properties/jobTitle/pattern',
            },
          ]),
        )
      }
    />,
  );

  await userEvent.click(getByText(/save/i));

  expect(await findByText(/unable to save your changes/i)).toBeVisible();
  expect(queryByText(invalidEmailMessage)).not.toBeInTheDocument();
  consoleMock.mockRestore();
});

describe('spacing between the validation message and the hint', () => {
  // Read the rule the modal actually emitted and ask whether it selects the
  // hint. Comparing against a selector written here would pass no matter what
  // the modal does.
  const spacingRuleSelectsHint = (hint: HTMLElement) => {
    const rule = [...document.querySelectorAll('style')]
      .flatMap((style) => [...(style.sheet?.cssRules ?? [])])
      .filter((cssRule): cssRule is CSSStyleRule => 'selectorText' in cssRule)
      .find(({ cssText }) => cssText.includes(`padding-top: ${rem(16)}`));

    return rule ? hint.matches(rule.selectorText) : false;
  };

  const contactHint = (getByText: (text: RegExp) => HTMLElement) =>
    getByText(/^Note: This will not affect/);

  it('leaves the hint alone while no message is showing', () => {
    const { getByText } = renderModal(
      <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
    );

    expect(spacingRuleSelectsHint(contactHint(getByText))).toBe(false);
  });

  it('clears the message by 16 once one is showing', async () => {
    const { getByLabelText, getByText } = renderModal(
      <ContactInfoModal fallbackEmail="fallback@example.com" backHref="#" />,
    );

    await userEvent.type(getByLabelText(/contact email/i), 'test@test');
    await userEvent.click(getByText(/save/i));

    expect(getByText(invalidEmailMessage)).toBeVisible();
    expect(spacingRuleSelectsHint(contactHint(getByText))).toBe(true);
  });
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = renderModal(
    <ContactInfoModal
      backHref="#"
      email="contact@example.com"
      fallbackEmail="fallback@example.com"
      onSave={handleSave}
    />,
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

it.each`
  label               | value
  ${'Website 1'}      | ${`website1`}
  ${'Website 2'}      | ${`website2`}
  ${'Researcher ID'}  | ${`researcherId`}
  ${'X'}              | ${`twitter`}
  ${'BlueSky'}        | ${`blueSky`}
  ${'Github'}         | ${`github`}
  ${'LinkedIn'}       | ${`linkedIn`}
  ${'Research Gate'}  | ${`researchGate`}
  ${'Google Scholar'} | ${`googleScholar`}
`('displays value $value for $label', ({ label, value }) => {
  const social: Required<UserResponse['social']> = {
    github: 'github',
    googleScholar: 'googleScholar',
    linkedIn: 'linkedIn',
    orcid: 'orcid',
    researchGate: 'researchGate',
    researcherId: 'researcherId',
    twitter: 'twitter',
    blueSky: 'blueSky',
    website1: 'website1',
    website2: 'website2',
  };
  const { getByLabelText } = renderModal(
    <ContactInfoModal
      fallbackEmail="fallback@example.com"
      email="contact@example.com"
      social={social}
      backHref="#"
    />,
  );
  const input = getByLabelText(new RegExp(label));
  expect(input).toHaveValue(value);
});

it.each`
  label              | value        | message
  ${'Website 1'}     | ${'not url'} | ${'valid URL'}
  ${'Website 2'}     | ${'not url'} | ${'valid URL'}
  ${'Researcher ID'} | ${'http://'} | ${'valid Researcher ID'}
`(
  'shows validation message "$message" for $label input',
  async ({ label, value, message }) => {
    // Suppress act() warnings from TextField's internal async validation state updates
    const consoleMock = mockActErrorsInConsole();

    const { getByLabelText, findByText } = renderModal(
      <ContactInfoModal backHref="#" fallbackEmail="fallback@example.com" />,
    );
    const input = getByLabelText(new RegExp(label));
    fireEvent.change(input, {
      target: { value },
    });
    fireEvent.focusOut(input);
    expect(await findByText(new RegExp(message, 'i'))).toBeVisible();

    consoleMock.mockRestore();
  },
);
