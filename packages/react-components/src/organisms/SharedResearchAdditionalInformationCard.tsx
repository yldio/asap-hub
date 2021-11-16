import { ResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { Card, Divider, Headline2, Link } from '../atoms';
import { externalLinkIcon } from '../icons';
import { mobileScreen, perRem } from '../pixels';
import { isLink } from '../utils';

const additionalInformationListStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `${6 / perRem}em 0`,
});
const additionalInformationEntryStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${6 / perRem}em 0`,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
  },
});
const additionalInformationValueStyles = css({
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginTop: `${12 / perRem}em`,
  },
});
const externalLinkStyle = css({
  display: 'flex',
});

type SharedResearchCardProps = Pick<
  ResearchOutputResponse,
  | 'sharingStatus'
  | 'asapFunded'
  | 'usedInPublication'
  | 'doi'
  | 'rrid'
  | 'accession'
  | 'labCatalogNumber'
>;

const SharedResearchAdditionalInformationCard: React.FC<SharedResearchCardProps> =
  ({
    sharingStatus,
    asapFunded,
    usedInPublication,
    doi,
    rrid,
    accession,
    labCatalogNumber,
  }) => (
    <Card>
      <Headline2 styleAsHeading={4}>Additional Information</Headline2>
      <ol css={additionalInformationListStyles}>
        <li css={additionalInformationEntryStyles}>
          <strong>Sharing Status</strong>
          <span css={additionalInformationValueStyles}>{sharingStatus}</span>
        </li>
        {asapFunded === undefined || (
          <>
            <Divider />
            <li css={additionalInformationEntryStyles}>
              <strong>ASAP Funded</strong>
              <span css={additionalInformationValueStyles}>
                {asapFunded ? 'Yes' : 'No'}
              </span>
            </li>
          </>
        )}
        {usedInPublication === undefined || (
          <>
            <Divider />
            <li css={additionalInformationEntryStyles}>
              <strong>Used in a Publication</strong>
              <span css={additionalInformationValueStyles}>
                {usedInPublication ? 'Yes' : 'No'}
              </span>
            </li>
          </>
        )}
        {doi === undefined || (
          <>
            <Divider />
            <li css={additionalInformationEntryStyles}>
              <strong>Identifier (DOI)</strong>
              <span css={additionalInformationValueStyles}>
                <Link
                  applyIconTheme
                  href={new URL(`https://doi.org/${doi}`).toString()}
                >
                  <div css={externalLinkStyle}>
                    <span>{doi}</span>
                    {externalLinkIcon}
                  </div>
                </Link>
              </span>
            </li>
          </>
        )}
        {rrid === undefined || (
          <>
            <Divider />
            <li css={additionalInformationEntryStyles}>
              <strong>Identifier (RRID)</strong>
              <span css={additionalInformationValueStyles}>
                <Link
                  applyIconTheme
                  href={new URL(
                    `https://scicrunch.org/resolver/${rrid}`,
                  ).toString()}
                >
                  <div css={externalLinkStyle}>
                    <span>{rrid}</span>
                    {externalLinkIcon}
                  </div>
                </Link>
              </span>
            </li>
          </>
        )}
        {accession === undefined || (
          <>
            <Divider />
            <li css={additionalInformationEntryStyles}>
              <strong>Identifier (Accession #)</strong>
              <span css={additionalInformationValueStyles}>{accession}</span>
            </li>
          </>
        )}
        {labCatalogNumber === undefined || (
          <>
            <Divider />
            <li css={additionalInformationEntryStyles}>
              <strong>Lab Catalog Number</strong>
              <span css={additionalInformationValueStyles}>
                {isLink(labCatalogNumber) ? (
                  <Link
                    applyIconTheme
                    href={new URL(labCatalogNumber).toString()}
                  >
                    <div css={externalLinkStyle}>
                      <span>External Link</span>
                      {externalLinkIcon}
                    </div>
                  </Link>
                ) : (
                  labCatalogNumber
                )}
              </span>
            </li>
          </>
        )}
      </ol>
    </Card>
  );

export default SharedResearchAdditionalInformationCard;
