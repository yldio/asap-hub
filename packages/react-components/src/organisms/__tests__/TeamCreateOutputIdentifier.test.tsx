import { ComponentProps } from 'react';
import { fireEvent, render } from '@testing-library/react';

import { ResearchOutputIdentifierType } from '@asap-hub/model';
import { TeamCreateOutputIdentifier } from '../TeamCreateOutputIdentifier';
import { ENTER_KEYCODE } from '../../atoms/Dropdown';

const props: ComponentProps<typeof TeamCreateOutputIdentifier> = {
  documentType: 'Article',
};

it('should render Identifier', () => {
  const { getByLabelText, getByText } = render(
    <TeamCreateOutputIdentifier {...props} />,
  );
  expect(getByLabelText(/Identifier/i)).toBeVisible();
  expect(getByText('Choose an identifier')).toBeVisible();
});

it('should clear the identifier field on entering something unknown', () => {
  const setIdentifierType = jest.fn();
  const { getByLabelText } = render(
    <TeamCreateOutputIdentifier
      {...props}
      setIdentifierType={setIdentifierType}
    />,
  );
  fireEvent.change(getByLabelText(/identifier/i), {
    target: {
      value: 'UNKNOWN',
    },
  });

  fireEvent.keyDown(getByLabelText(/identifier/i), { keyCode: ENTER_KEYCODE });

  expect(getByLabelText(/identifier/i)).toHaveValue(
    ResearchOutputIdentifierType.None,
  );
});

it('shows error message for missing value', () => {
  const { getByLabelText, getByText } = render(
    <TeamCreateOutputIdentifier {...props} />,
  );
  fireEvent.focusOut(getByLabelText(/identifier/i));
  expect(getByText('Please choose an identifier')).toBeVisible();
});

it('should set the identifier to the selected value', () => {
  const setIdentifierType = jest.fn();
  const { getByLabelText } = render(
    <TeamCreateOutputIdentifier
      {...props}
      setIdentifierType={setIdentifierType}
    />,
  );
  fireEvent.change(getByLabelText(/identifier/i), {
    target: {
      value: 'DOI',
    },
  });

  fireEvent.keyDown(getByLabelText(/identifier/i), { keyCode: ENTER_KEYCODE });

  expect(getByLabelText(/identifier/i)).toHaveValue(
    ResearchOutputIdentifierType.DOI,
  );
});

describe('RRID', () => {
  it('should show an error when it does not match regex', async () => {
    const { getByText, getByPlaceholderText } = render(
      <TeamCreateOutputIdentifier
        {...props}
        identifierType={ResearchOutputIdentifierType.RRID}
        identifier="RRI:123"
      />,
    );
    fireEvent.blur(getByPlaceholderText(/rrid/i));
    expect(getByText(/Please enter a valid RRID/i)).toBeVisible();
  });

  it('shows no error if regex matches', () => {
    const { getByText, getByPlaceholderText } = render(
      <TeamCreateOutputIdentifier
        {...props}
        identifierType={ResearchOutputIdentifierType.RRID}
        identifier="RRID:AB123"
      />,
    );

    fireEvent.blur(getByPlaceholderText(/rrid/i));
    expect(() => getByText(/Please enter a valid RRID/i)).toThrowError();
  });
});

describe('DOI', () => {
  it('should show an error when it does not match regex', async () => {
    const { getByText, getByPlaceholderText } = render(
      <TeamCreateOutputIdentifier
        {...props}
        identifierType={ResearchOutputIdentifierType.DOI}
        identifier="doidoi"
      />,
    );
    fireEvent.blur(getByPlaceholderText(/doi/i));
    expect(getByText(/Please enter a valid DOI/i)).toBeVisible();
  });

  it('shows no error if regex matches', () => {
    const { getByText, getByPlaceholderText } = render(
      <TeamCreateOutputIdentifier
        {...props}
        identifierType={ResearchOutputIdentifierType.DOI}
        identifier="doi:10.1234"
      />,
    );

    fireEvent.blur(getByPlaceholderText(/doi/i));
    expect(() => getByText(/Please enter a valid DOI/i)).toThrowError();
  });
});

describe('AccessionNumber', () => {
  it('should show an error when it does not match regex', async () => {
    const { getByText, getByPlaceholderText } = render(
      <TeamCreateOutputIdentifier
        {...props}
        identifierType={ResearchOutputIdentifierType.AccessionNumber}
        identifier="NP_wrong"
      />,
    );
    fireEvent.blur(getByPlaceholderText(/accession/i));
    expect(getByText(/Please enter a valid Accession/i)).toBeVisible();
  });

  it('shows no error if regex matches', () => {
    const { getByText, getByPlaceholderText } = render(
      <TeamCreateOutputIdentifier
        {...props}
        identifierType={ResearchOutputIdentifierType.AccessionNumber}
        identifier="NP_1234567"
      />,
    );

    fireEvent.blur(getByPlaceholderText(/accession/i));
    expect(() => getByText(/Please enter a valid Accession/i)).toThrowError();
  });
});
