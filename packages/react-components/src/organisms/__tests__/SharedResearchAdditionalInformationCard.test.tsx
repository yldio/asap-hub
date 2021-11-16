import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import SharedResearchAdditionalInformationCard from '../SharedResearchAdditionalInformationCard';

const props: ComponentProps<typeof SharedResearchAdditionalInformationCard> = {
  ...createResearchOutputResponse(),
};
it('contains the sharing status', () => {
  const { getByText } = render(
    <SharedResearchAdditionalInformationCard
      {...props}
      sharingStatus="Network Only"
    />,
  );
  expect(getByText('Network Only')).toBeVisible();
});

it('contains the publication use status', () => {
  const { getByText, rerender } = render(
    <SharedResearchAdditionalInformationCard {...props} usedInPublication />,
  );
  expect(getByText(/used in.+pub/i).closest('li')).toHaveTextContent(/yes/i);

  rerender(
    <SharedResearchAdditionalInformationCard
      {...props}
      usedInPublication={false}
    />,
  );
  expect(getByText(/used in.+pub/i).closest('li')).toHaveTextContent(/no/i);
});
it('omits the publication use status if unknown', () => {
  const { queryByText } = render(
    <SharedResearchAdditionalInformationCard
      {...props}
      usedInPublication={undefined}
    />,
  );
  expect(queryByText(/used in.+pub/i)).not.toBeInTheDocument();
});

it('contains the ASAP funding status', () => {
  const { getByText, rerender } = render(
    <SharedResearchAdditionalInformationCard {...props} asapFunded />,
  );
  expect(getByText(/asap.funded/i).closest('li')).toHaveTextContent(/yes/i);

  rerender(
    <SharedResearchAdditionalInformationCard {...props} asapFunded={false} />,
  );
  expect(getByText(/asap.funded/i).closest('li')).toHaveTextContent(/no/i);
});
it('omits the ASAP funding status if unknown', () => {
  const { queryByText } = render(
    <SharedResearchAdditionalInformationCard
      {...props}
      asapFunded={undefined}
    />,
  );
  expect(queryByText(/asap.funded/i)).not.toBeInTheDocument();
});
it('contains doi and builds the correct href', () => {
  const doiValue = '10.1101/gr.10.12.1841';
  const expectedLink = new URL(`https://doi.org/${doiValue}`).toString();
  const { getByText } = render(
    <SharedResearchAdditionalInformationCard {...props} doi={doiValue} />,
  );
  expect(getByText(doiValue)?.closest('a')).toHaveAttribute(
    'href',
    expectedLink,
  );
});
it('contains rrid and builds the correct href', () => {
  const rridValue = 'RRID:SCR_007358';
  const expectedLink = new URL(
    `https://scicrunch.org/resolver/${rridValue}`,
  ).toString();
  const { getByText } = render(
    <SharedResearchAdditionalInformationCard {...props} rrid={rridValue} />,
  );
  expect(getByText(rridValue)?.closest('a')).toHaveAttribute(
    'href',
    expectedLink,
  );
});
it('contains accession', () => {
  const accessionValue = 'NC_000001.11';
  const { getByText } = render(
    <SharedResearchAdditionalInformationCard
      {...props}
      accession={accessionValue}
    />,
  );
  expect(getByText(accessionValue)).toBeInTheDocument();
});
it('contains labCatalogNumber and builds the correct href', () => {
  const labCatalogNumberLink = 'https://example.com';
  const labCatalogNumberText = '0000-0004-9946-3696';
  const expectedLink = new URL(labCatalogNumberLink).toString();
  const { rerender, queryByText } = render(
    <SharedResearchAdditionalInformationCard
      {...props}
      labCatalogNumber={labCatalogNumberLink}
    />,
  );
  expect(
    queryByText(/external.link/i, { selector: 'span' })?.closest('a'),
  ).toHaveAttribute('href', expectedLink);

  rerender(
    <SharedResearchAdditionalInformationCard
      {...props}
      labCatalogNumber={labCatalogNumberText}
    />,
  );
  expect(
    queryByText(/external.link/i, { selector: 'span' }),
  ).not.toBeInTheDocument();
  expect(queryByText(labCatalogNumberText)).toBeInTheDocument();
});
