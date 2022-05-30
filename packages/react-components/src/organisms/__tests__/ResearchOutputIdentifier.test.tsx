import { ResearchOutputIdentifierType } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { ResearchOutputIdentifier } from '../ResearchOutputIdentifier';

const props: ComponentProps<typeof ResearchOutputIdentifier> = {
  documentType: 'Article',
  required: false,
};

it('should render Identifier', () => {
  render(<ResearchOutputIdentifier {...props} />);
  expect(screen.getByRole('textbox', { name: /Identifier/i })).toBeVisible();
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
  expect(screen.getByLabelText(/identifier/i)).toHaveValue('');
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

it('if required shows error message for missing value', () => {
  render(<ResearchOutputIdentifier {...props} required={true} />);
  screen.getByRole('textbox', { name: /identifier/i }).focus();
  screen.getByRole('textbox', { name: /identifier/i }).blur();
  expect(screen.getByText('Please choose an identifier')).toBeInTheDocument();
});
it('if not required then does not show error message for missing value', () => {
  render(<ResearchOutputIdentifier {...props} required={false} />);
  screen.getByRole('textbox', { name: /identifier/i }).focus();
  screen.getByRole('textbox', { name: /identifier/i }).blur();
  expect(
    screen.queryByText('Please choose an identifier'),
  ).not.toBeInTheDocument();
});
it('should not show a validation message for a required component when re rendered as optional', () => {
  const { rerender } = render(
    <ResearchOutputIdentifier {...props} required={true} />,
  );
  screen.getByRole('textbox', { name: /identifier/i }).focus();
  screen.getByRole('textbox', { name: /identifier/i }).blur();
  expect(screen.getByText('Please choose an identifier')).toBeInTheDocument();
  rerender(<ResearchOutputIdentifier {...props} required={false} />);
  expect(
    screen.queryByText('Please choose an identifier'),
  ).not.toBeInTheDocument();
});

it('switching to required should not show a validation message', () => {
  const { rerender } = render(
    <ResearchOutputIdentifier {...props} required={false} />,
  );
  screen.getByRole('textbox', { name: /identifier/i }).focus();
  screen.getByRole('textbox', { name: /identifier/i }).blur();
  expect(
    screen.queryByText('Please choose an identifier'),
  ).not.toBeInTheDocument();
  rerender(<ResearchOutputIdentifier {...props} required={true} />);
  expect(
    screen.queryByText('Please choose an identifier'),
  ).not.toBeInTheDocument();
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

it('If required, required should be displayed', () => {
  const { rerender } = render(<ResearchOutputIdentifier {...props} />);
  const textbox = screen.getByRole('textbox', { name: /identifier/i });
  userEvent.click(textbox);

  expect(
    screen.getByRole('textbox', { name: 'Identifier Type (optional)' }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('textbox', { name: 'Identifier Type (required)' }),
  ).not.toBeInTheDocument();

  rerender(<ResearchOutputIdentifier {...props} required={true} />);
  userEvent.click(textbox);

  expect(
    screen.queryByRole('textbox', { name: 'Identifier Type (optional)' }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('textbox', { name: 'Identifier Type (required)' }),
  ).toBeInTheDocument();
});
