import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import OutputIdentifier from '../OutputIdentifier';

const props: ComponentProps<typeof OutputIdentifier> = {
  documentType: 'Article',
};

it('should render Identifier', () => {
  render(<OutputIdentifier {...props} />);
  expect(
    screen.getByRole('textbox', { name: /Identifier Type/i }),
  ).toBeVisible();
});

it('should render Identifier info with DOI and RRID', () => {
  render(<OutputIdentifier {...props} documentType="Code/Software" />);
  const infoButton = screen.getByRole('button', {
    name: /info/i,
  });
  expect(infoButton).toBeVisible();
  userEvent.click(infoButton);
  expect(screen.getByText(/Your DOI must start/i)).toBeVisible();
  expect(screen.getByText(/Your RRID must start/i)).toBeInTheDocument();
  expect(
    screen.queryByText(/Your Accession Number must start/i),
  ).not.toBeInTheDocument();
});

it('should render Identifier info with DOI and Accession Number', () => {
  render(<OutputIdentifier {...props} documentType="Dataset" />);
  const infoButton = screen.getByRole('button', {
    name: /info/i,
  });
  expect(infoButton).toBeVisible();
  userEvent.click(infoButton);
  expect(screen.getByText(/Your DOI must start/i)).toBeVisible();
  expect(screen.queryByText(/Your RRID must start/i)).not.toBeInTheDocument();
  expect(
    screen.getByText(/Your Accession Number must start/i),
  ).toBeInTheDocument();
});

it('should reset the identifier to a valid value on entering something unknown', () => {
  const setIdentifierType = jest.fn();
  render(<OutputIdentifier {...props} setIdentifierType={setIdentifierType} />);
  const textbox = screen.getByRole('textbox', { name: /identifier type/i });
  userEvent.type(textbox, 'UNKNOWN{enter}');
  textbox.blur();

  expect(screen.getByText('Choose an identifier...')).toBeVisible();
  expect(screen.getByRole('textbox', { name: /Identifier/i })).toHaveValue('');
});

it('should set the identifier to the selected value', () => {
  const setIdentifierType = jest.fn();
  render(<OutputIdentifier {...props} setIdentifierType={setIdentifierType} />);
  const textbox = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.type(textbox, 'DOI{enter}');
  textbox.blur();

  expect(setIdentifierType).toHaveBeenCalledWith(gp2.OutputIdentifierType.DOI);
});

it('should show an error when field is required but no input is provided', async () => {
  render(
    <OutputIdentifier
      {...props}
      identifierType={gp2.OutputIdentifierType.RRID}
    />,
  );
  screen.getByRole('textbox', { name: /rrid/i }).focus();
  screen.getByRole('textbox', { name: /rrid/i }).blur();
  expect(screen.getByText(/Please enter a valid RRID/i)).toBeVisible();
});

describe.each`
  description          | type                                        | identifier      | isValid  | name            | error
  ${'RRID'}            | ${gp2.OutputIdentifierType.RRID}            | ${'RRI:123'}    | ${false} | ${/rrid/i}      | ${/Please enter a valid RRID/i}
  ${'RRID'}            | ${gp2.OutputIdentifierType.RRID}            | ${'RRID:AB123'} | ${true}  | ${/rrid/i}      | ${/Please enter a valid RRID/i}
  ${'DOI'}             | ${gp2.OutputIdentifierType.DOI}             | ${'11.1234'}    | ${false} | ${/doi/i}       | ${/Please enter a valid DOI/i}
  ${'DOI'}             | ${gp2.OutputIdentifierType.DOI}             | ${'10.1234'}    | ${true}  | ${/doi/i}       | ${/Please enter a valid DOI/i}
  ${'AccessionNumber'} | ${gp2.OutputIdentifierType.AccessionNumber} | ${'NP_wrong'}   | ${false} | ${/accession/i} | ${/Please enter a valid Accession/i}
  ${'AccessionNumber'} | ${gp2.OutputIdentifierType.AccessionNumber} | ${'NP_1234567'} | ${true}  | ${/accession/i} | ${/Please enter a valid Accession/i}
`('$description', ({ type, identifier, isValid, name, error }) => {
  const assertError = () => {
    if (isValid) {
      expect(screen.queryByText(error)).not.toBeInTheDocument();
    } else {
      expect(screen.getByText(error)).toBeVisible();
    }
  };
  it(`shows ${isValid ? 'no' : ''} error `, async () => {
    render(
      <OutputIdentifier
        {...props}
        identifierType={type}
        identifier={identifier}
      />,
    );
    screen.getByRole('textbox', { name }).focus();
    screen.getByRole('textbox', { name }).blur();
    expect.assertions(1);
    assertError();
  });
});
