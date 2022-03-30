import { ComponentProps } from 'react';
import { fireEvent, render } from '@testing-library/react';

import { ResearchOutputIdentifierType } from '@asap-hub/model';
import { TeamCreateOutputIdentifier } from '../TeamCreateOutputIdentifier';
import { noop } from '../../utils';

const props: ComponentProps<typeof TeamCreateOutputIdentifier> = {
  identifierType: ResearchOutputIdentifierType.None,
  identifier: '',
  setIdentifier: noop,
  setIdentifierType: noop,
  type: 'Article',
  required: false,
};

it('should render Identifier', () => {
  const { getByText } = render(<TeamCreateOutputIdentifier {...props} />);
  expect(getByText(/Identifier/i)).toBeVisible();
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
