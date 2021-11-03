import React, { ComponentProps } from 'react';
import { css } from '@emotion/react';
import { ResearchOutputResponse } from '@asap-hub/model';

import { Card, Headline2, Divider, Link } from '../atoms';
import { mobileScreen, perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { BackLink, CtaCard, TagList } from '../molecules';
import { RichText, SharedResearchOutputHeaderCard } from '../organisms';
import { createMailTo } from '../mail';
import { externalLinkIcon } from '../icons';
import { isLink } from '../utils';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const cardsStyles = css({
  display: 'grid',
  rowGap: `${36 / perRem}em`,
});

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

type SharedResearchOutputProps = Pick<
  ResearchOutputResponse,
  | 'description'
  | 'tags'
  | 'accessInstructions'
  | 'sharingStatus'
  | 'asapFunded'
  | 'usedInPublication'
  | 'contactEmails'
  | 'doi'
  | 'rrid'
  | 'accession'
  | 'labCatalogNumber'
> &
  ComponentProps<typeof SharedResearchOutputHeaderCard> & {
    backHref: string;
  };

const SharedResearchOutput: React.FC<SharedResearchOutputProps> = ({
  description,
  backHref,
  tags,
  accessInstructions,
  sharingStatus,
  asapFunded,
  usedInPublication,
  contactEmails,
  doi,
  rrid,
  accession,
  labCatalogNumber,
  ...props
}) => (
  <div css={containerStyles}>
    <BackLink href={backHref} />
    <div css={cardsStyles}>
      <SharedResearchOutputHeaderCard {...props} />
      {(description || !!tags.length) && (
        <Card>
          {description && (
            <div css={{ paddingBottom: `${12 / perRem}em` }}>
              <Headline2 styleAsHeading={4}>Description</Headline2>
              <RichText poorText text={description} />
            </div>
          )}
          {description && !!tags.length && <Divider />}
          {!!tags.length && (
            <>
              <Headline2 styleAsHeading={4}>Tags</Headline2>
              <TagList tags={tags} />
            </>
          )}
        </Card>
      )}
      {accessInstructions && (
        <Card>
          <div css={{ paddingBottom: `${12 / perRem}em` }}>
            <Headline2 styleAsHeading={4}>Access Instructions</Headline2>
            <RichText poorText text={accessInstructions} />
          </div>
        </Card>
      )}
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
      {!!contactEmails.length && (
        <CtaCard href={createMailTo(contactEmails)} buttonText="Contact PM">
          <strong>Interested in what you have seen?</strong>
          <br /> Reach out to the PMs associated with this output
        </CtaCard>
      )}
    </div>
  </div>
);
export default SharedResearchOutput;
