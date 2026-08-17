import { ResearchOutputIdentifierType } from '@asap-hub/model';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import {
  getIdentifierValidationRules,
  ResearchOutputIdentifier,
} from '../ResearchOutputIdentifier';
import { mockActErrorsInConsole } from '../../test-utils';
import { renderWithResearchOutputForm } from '../test-utils/research-output-form';

const props: ComponentProps<typeof ResearchOutputIdentifier> = {
  documentType: 'Article',
};

describe('getIdentifierValidationRules', () => {
  it('includes a pattern rule when the identifier type has a regex', () => {
    const rules = getIdentifierValidationRules(
      ResearchOutputIdentifierType.DOI,
    );

    expect(rules.pattern).toEqual(
      expect.objectContaining({
        value: expect.any(RegExp),
        message: expect.stringMatching(/valid DOI/i),
      }),
    );
    expect(rules.pattern?.value.test('10.1234/abc')).toBe(true);
    expect(rules.pattern?.value.test('not-a-doi')).toBe(false);
  });

  it('omits the pattern rule when the identifier type has no regex', () => {
    expect(
      getIdentifierValidationRules(ResearchOutputIdentifierType.None),
    ).toEqual({ required: false });
    expect(
      getIdentifierValidationRules(ResearchOutputIdentifierType.Empty),
    ).toEqual({ required: false });
  });
});

it('should render Identifier', () => {
  renderWithResearchOutputForm(<ResearchOutputIdentifier {...props} />);
  expect(
    screen.getByRole('combobox', { name: /Identifier Type/i }),
  ).toBeVisible();
});

it('should render Identifier info with DOI and RRID', async () => {
  renderWithResearchOutputForm(
    <ResearchOutputIdentifier {...props} documentType={'Lab Material'} />,
  );
  const infoButton = screen.getByRole('button', {
    name: /info/i,
  });
  expect(infoButton).toBeVisible();
  await userEvent.click(infoButton);
  expect(screen.getByText(/Your DOI must start/i)).toBeVisible();
  expect(screen.queryByText(/Your RRID must start/i)).toBeInTheDocument();
  expect(
    screen.queryByText(/Your Accession Number must start/i),
  ).not.toBeInTheDocument();
});

it('should render Identifier info with DOI and Accession Number', async () => {
  renderWithResearchOutputForm(
    <ResearchOutputIdentifier {...props} documentType={'Dataset'} />,
  );
  const infoButton = screen.getByRole('button', {
    name: /info/i,
  });
  expect(infoButton).toBeVisible();
  await userEvent.click(infoButton);
  expect(screen.getByText(/Your DOI must start/i)).toBeVisible();
  expect(screen.queryByText(/Your RRID must start/i)).not.toBeInTheDocument();
  expect(
    screen.queryByText(/Your Accession Number must start/i),
  ).toBeInTheDocument();
});

it('should reset the identifier to a valid value on entering something unknown', async () => {
  renderWithResearchOutputForm(<ResearchOutputIdentifier {...props} />);
  const combobox = screen.getByRole('combobox', { name: /Identifier Type/i });
  await userEvent.type(combobox, 'UNKNOWN');
  await userEvent.type(combobox, '{Enter}');
  await userEvent.tab();

  await waitFor(() => {
    expect(screen.getByText('Choose an identifier')).toBeVisible();
  });
  expect(
    screen.getByRole('combobox', { name: /Identifier Type/i }),
  ).toHaveValue('');
});

it('should set the identifier type form value to the selected value', async () => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputIdentifier {...props} />,
  );
  const combobox = screen.getByRole('combobox', { name: /Identifier Type/i });
  await userEvent.type(combobox, 'DOI');

  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'DOI' })).toBeInTheDocument();
  });

  await userEvent.type(combobox, '{Enter}');
  await userEvent.tab();

  await waitFor(() => {
    expect(methodsRef.current?.getValues('identifierType')).toEqual(
      ResearchOutputIdentifierType.DOI,
    );
  });
});

it('should show an error when no identifier type is chosen', async () => {
  const { findByText } = renderWithResearchOutputForm(
    <ResearchOutputIdentifier {...props} />,
  );

  await userEvent.click(
    screen.getByRole('combobox', { name: /Identifier Type/i }),
  );
  await userEvent.tab();

  expect(await findByText('Please choose an identifier.')).toBeVisible();
});

it('should show a pattern validation error for an invalid identifier value', async () => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputIdentifier {...props} />,
    {
      defaultValues: {
        identifierType: ResearchOutputIdentifierType.DOI,
        identifier: '',
      },
    },
  );

  const textbox = screen.getByRole('textbox', { name: /doi/i });
  await userEvent.clear(textbox);
  await userEvent.type(textbox, 'not-a-valid-doi');
  await userEvent.tab();

  expect(await screen.findByText(/Please enter a valid DOI/i)).toBeVisible();
  expect(methodsRef.current?.getFieldState('identifier').error?.type).toBe(
    'pattern',
  );
});

it('should clear the identifier when the identifier type changes', async () => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputIdentifier {...props} />,
    {
      defaultValues: {
        identifierType: ResearchOutputIdentifierType.DOI,
        identifier: '10.1234',
      },
    },
  );

  const combobox = screen.getByRole('combobox', { name: /Identifier Type/i });
  await userEvent.type(combobox, 'None');
  await waitFor(() => {
    expect(screen.getByRole('option', { name: 'None' })).toBeInTheDocument();
  });
  await userEvent.type(combobox, '{Enter}');

  await waitFor(() => {
    expect(methodsRef.current?.getValues('identifier')).toEqual('');
  });
  expect(
    screen.queryByRole('textbox', { name: /doi/i }),
  ).not.toBeInTheDocument();
});

it('should show an error when field is required but no input is provided', async () => {
  renderWithResearchOutputForm(<ResearchOutputIdentifier {...props} />, {
    defaultValues: { identifierType: ResearchOutputIdentifierType.RRID },
  });
  const textbox = screen.getByRole('textbox', { name: /rrid/i });
  await userEvent.click(textbox);
  await userEvent.tab();
  await waitFor(() => {
    expect(screen.getByText(/Please enter a valid RRID/i)).toBeVisible();
  });
});

describe.each`
  description          | type                                            | identifier      | isValid  | name            | error
  ${'RRID'}            | ${ResearchOutputIdentifierType.RRID}            | ${'RRI:123'}    | ${false} | ${/rrid/i}      | ${/Please enter a valid RRID/i}
  ${'RRID'}            | ${ResearchOutputIdentifierType.RRID}            | ${'RRID:AB123'} | ${true}  | ${/rrid/i}      | ${/Please enter a valid RRID/i}
  ${'DOI'}             | ${ResearchOutputIdentifierType.DOI}             | ${'doidoi'}     | ${false} | ${/doi/i}       | ${/Please enter a valid DOI/i}
  ${'DOI'}             | ${ResearchOutputIdentifierType.DOI}             | ${'10.1234'}    | ${true}  | ${/doi/i}       | ${/Please enter a valid DOI/i}
  ${'AccessionNumber'} | ${ResearchOutputIdentifierType.AccessionNumber} | ${'NP_wrong'}   | ${false} | ${/accession/i} | ${/Please enter a valid Accession/i}
  ${'AccessionNumber'} | ${ResearchOutputIdentifierType.AccessionNumber} | ${'NP_1234567'} | ${true}  | ${/accession/i} | ${/Please enter a valid Accession/i}
`('$description', ({ type, identifier, isValid, name, error }) => {
  let consoleMock: ReturnType<typeof mockActErrorsInConsole>;

  beforeEach(() => {
    consoleMock = mockActErrorsInConsole();
  });

  afterEach(() => {
    consoleMock.mockRestore();
  });

  it(`shows ${isValid ? 'no ' : ''}error`, async () => {
    renderWithResearchOutputForm(<ResearchOutputIdentifier {...props} />, {
      defaultValues: { identifierType: type, identifier },
    });
    const textbox = screen.getByRole('textbox', { name });
    await userEvent.click(textbox);
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.queryByText(error) === null).toBe(isValid);
    });
  });
});
