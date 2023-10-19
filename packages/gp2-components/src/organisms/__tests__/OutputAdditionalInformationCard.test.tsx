import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import OutputAdditionalInformationCard from '../OutputAdditionalInformationCard';

const props: ComponentProps<typeof OutputAdditionalInformationCard> = {
  ...gp2Fixtures.createOutputResponse(),
};
it('contains the sharing status', () => {
  render(
    <OutputAdditionalInformationCard {...props} sharingStatus="GP2 Only" />,
  );
  expect(screen.getByText('GP2 Only')).toBeVisible();
});

it('does not contain the date when sharing status is GP2 Only', () => {
  render(
    <OutputAdditionalInformationCard {...props} sharingStatus="GP2 Only" />,
  );

  expect(screen.queryByText(/published date/)).not.toBeInTheDocument();
});

it('does not contain the date when date is undefined', () => {
  render(<OutputAdditionalInformationCard {...props} sharingStatus="Public" />);

  expect(screen.queryByText(/published date/)).not.toBeInTheDocument();
});

it('contains the date when sharing status is Public', () => {
  render(
    <OutputAdditionalInformationCard
      {...props}
      sharingStatus="Public"
      publishDate="2023-10-27T10:00:00.000+01:00"
    />,
  );

  expect(screen.getByText('Public')).toBeVisible();
  expect(screen.getByText(/published date/i)).toBeVisible();
  expect(screen.getByText('FRI, 27 OCT 2023')).toBeVisible();
});
it('omits the gp2 supported when unknown', () => {
  const { rerender } = render(
    <OutputAdditionalInformationCard {...props} gp2Supported="Don't Know" />,
  );
  expect(screen.queryByText(/gp2 supported/i)).not.toBeInTheDocument();

  rerender(
    <OutputAdditionalInformationCard {...props} gp2Supported={undefined} />,
  );

  expect(screen.queryByText(/gp2 supported/i)).not.toBeInTheDocument();
});

it('contains the GP2 supported status', () => {
  const { rerender } = render(
    <OutputAdditionalInformationCard {...props} gp2Supported="Yes" />,
  );
  expect(screen.getByText(/gp2 supported/i).closest('li')).toHaveTextContent(
    /yes/i,
  );

  rerender(<OutputAdditionalInformationCard {...props} gp2Supported="No" />);
  expect(screen.getByText(/gp2 supported/i).closest('li')).toHaveTextContent(
    /no/i,
  );
});

it('contains doi and builds the correct href', () => {
  const doiValue = '10.1101/gr.10.12.1841';
  const expectedLink = new URL(`https://doi.org/${doiValue}`).toString();
  const { getByText } = render(
    <OutputAdditionalInformationCard {...props} doi={doiValue} />,
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
    <OutputAdditionalInformationCard {...props} rrid={rridValue} />,
  );
  expect(getByText(rridValue)?.closest('a')).toHaveAttribute(
    'href',
    expectedLink,
  );
});
it('contains accession', () => {
  const accessionValue = 'NC_000001.11';
  const { getByText } = render(
    <OutputAdditionalInformationCard
      {...props}
      accessionNumber={accessionValue}
    />,
  );
  expect(getByText(accessionValue)).toBeInTheDocument();
});
