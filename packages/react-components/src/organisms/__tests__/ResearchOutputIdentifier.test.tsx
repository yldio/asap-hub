import { ResearchOutputIdentifierType } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { ResearchOutputIdentifier } from '../ResearchOutputIdentifier';

const props: ComponentProps<typeof ResearchOutputIdentifier> = {
  documentType: 'Article',
};

it('should render Identifier', () => {
  render(<ResearchOutputIdentifier {...props} />);
  expect(screen.getByRole('textbox', { name: /Identifier/i })).toBeVisible();
});

it('should render Identifier info', () => {
  render(<ResearchOutputIdentifier {...props} />);
  const infoButton = screen.getByRole('button', {
    name: /info/i,
  });
  expect(infoButton).toBeVisible();
  userEvent.click(infoButton);
  expect(screen.getByText(/Your DOI must start/i)).toBeVisible();
  expect(screen.queryByText(/Your RRID must start/i)).not.toBeInTheDocument();
  expect(
    screen.queryByText(/Your Accession Number must start/i),
  ).not.toBeInTheDocument();
});

it('should reset the identifier to a valid value on entering something unknown', () => {
  const setIdentifierType = jest.fn();
  render(
    <ResearchOutputIdentifier
      {...props}
      setIdentifierType={setIdentifierType}
    />,
  );
  const textbox = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.type(textbox, 'UNKNOWN');
  userEvent.type(textbox, specialChars.enter);
  textbox.blur();

  expect(screen.getByText('Choose an identifier')).toBeVisible();
  expect(screen.getByRole('textbox', { name: /Identifier/i })).toHaveValue('');
});

it('should set the identifier to the selected value', () => {
  const setIdentifierType = jest.fn();
  render(
    <ResearchOutputIdentifier
      {...props}
      setIdentifierType={setIdentifierType}
    />,
  );
  const textbox = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.type(textbox, 'DOI');
  userEvent.type(textbox, specialChars.enter);
  textbox.blur();

  expect(setIdentifierType).toHaveBeenCalledWith(
    ResearchOutputIdentifierType.DOI,
  );
});

it('should show an error when field is required but no input is provided', async () => {
  render(
    <ResearchOutputIdentifier
      {...props}
      identifierType={ResearchOutputIdentifierType.RRID}
    />,
  );
  screen.getByRole('textbox', { name: /rrid/i }).focus();
  screen.getByRole('textbox', { name: /rrid/i }).blur();
  expect(screen.getByText(/Please enter a valid RRID/i)).toBeVisible();
});

describe.each`
  description          | type                                            | identifier       | isValid  | name            | error
  ${'RRID'}            | ${ResearchOutputIdentifierType.RRID}            | ${'RRI:123'}     | ${false} | ${/rrid/i}      | ${/Please enter a valid RRID/i}
  ${'RRID'}            | ${ResearchOutputIdentifierType.RRID}            | ${'RRID:AB123'}  | ${true}  | ${/rrid/i}      | ${/Please enter a valid RRID/i}
  ${'DOI'}             | ${ResearchOutputIdentifierType.DOI}             | ${'doidoi'}      | ${false} | ${/doi/i}       | ${/Please enter a valid DOI/i}
  ${'DOI'}             | ${ResearchOutputIdentifierType.DOI}             | ${'doi:10.1234'} | ${true}  | ${/doi/i}       | ${/Please enter a valid DOI/i}
  ${'AccessionNumber'} | ${ResearchOutputIdentifierType.AccessionNumber} | ${'NP_wrong'}    | ${false} | ${/accession/i} | ${/Please enter a valid Accession/i}
  ${'AccessionNumber'} | ${ResearchOutputIdentifierType.AccessionNumber} | ${'NP_1234567'}  | ${true}  | ${/accession/i} | ${/Please enter a valid Accession/i}
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
      <ResearchOutputIdentifier
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
