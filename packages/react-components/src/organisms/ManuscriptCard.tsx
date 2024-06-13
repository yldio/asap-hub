import { ManuscriptVersion, TeamManuscript } from '@asap-hub/model';
import { css } from '@emotion/react';
import { useState } from 'react';
import {
  Button,
  colors,
  minusRectIcon,
  Pill,
  plusRectIcon,
  Subtitle,
  article,
  Divider,
  Link,
  lead,
} from '..';
import { paddingStyles } from '../card';
import { mobileScreen, perRem, rem } from '../pixels';

type ManuscriptCardProps = Pick<TeamManuscript, 'id' | 'title' | 'versions'>;

const manuscriptContainerStyles = css({
  marginTop: rem(12),
  border: `1px solid ${colors.steel.rgb}`,
  borderRadius: `${rem(8)}`,
  boxSizing: 'border-box',
  width: '100%',
  borderWidth: 1,
  borderStyle: 'solid',
  display: 'block',
});

const toastStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${15 / perRem}em ${24 / perRem}em`,
  borderRadius: `${rem(8)} ${rem(8)} 0 0`,
  backgroundColor: colors.pearl.rgb,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

const iconStyles = css({
  display: 'inline-block',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  paddingRight: `${12 / perRem}em`,
});

const toastHeaderStyles = css({
  display: 'flex',
  alignItems: 'center',

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    alignItems: 'flex-start',
  },
});

const toastContentStyles = css({
  paddingLeft: `${60 / perRem}em`,
  paddingTop: rem(15),
});

const dividerStyles = css({
  display: 'block',
  margin: `${rem(21)} 0`,
});

const additionalInformationListStyles = css({
  listStyle: 'none',
  margin: 0,
  padding: `${rem(6)} 0`,
});
const additionalInformationEntryStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${rem(8)} 0`,
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column',
  },
});
const additionalInformationValueStyles = css({
  textAlign: 'right',
  color: lead.rgb,
  overflowWrap: 'anywhere',

  [`@media (max-width: ${mobileScreen.max}px)`]: {
    marginTop: `${rem(12)}`,
    textAlign: 'inherit',
  },
});

const hasAdditionalInfo = (version: ManuscriptVersion) =>
  version.preprintDoi ||
  version.publicationDoi ||
  version.requestingApcCoverage ||
  version.otherDetails;

const ManuscriptCard: React.FC<ManuscriptCardProps> = ({ title, versions }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div css={manuscriptContainerStyles}>
      <div
        css={[
          { borderBottom: expanded ? `1px solid ${colors.steel.rgb}` : 'none' },
          toastStyles,
        ]}
      >
        <span css={toastHeaderStyles}>
          <span css={[iconStyles]}>
            <Button linkStyle onClick={() => setExpanded(!expanded)}>
              <span>{expanded ? minusRectIcon : plusRectIcon}</span>
            </Button>
          </span>
          <Subtitle noMargin>{title}</Subtitle>
        </span>
      </div>

      {expanded && (
        <div>
          {versions.map((version, index) => (
            <div key={index} css={[paddingStyles, toastContentStyles]}>
              <span css={toastHeaderStyles}>
                <span css={[iconStyles]}>{article}</span>
                <Subtitle noMargin>Manuscript</Subtitle>
              </span>
              <div
                style={{ display: 'flex', gap: rem(10), marginTop: rem(15) }}
                key={index}
              >
                <Pill accent="gray">{version.type}</Pill>
                <Pill accent="gray">{version.lifecycle}</Pill>
              </div>
              {hasAdditionalInfo(version) && (
                <div>
                  <span css={dividerStyles}>
                    <Divider />
                  </span>
                  <span
                    css={{
                      fontStyle: 'italic',
                      marginBottom: rem(12),
                      display: 'block',
                    }}
                  >
                    <Subtitle>Additional Information</Subtitle>
                  </span>

                  <ol css={additionalInformationListStyles}>
                    {version.preprintDoi && (
                      <li css={additionalInformationEntryStyles}>
                        <strong>Preprint DOI</strong>
                        <span css={additionalInformationValueStyles}>
                          <Link
                            href={new URL(
                              `https://doi.org/${version.preprintDoi}`,
                            ).toString()}
                          >
                            {version.preprintDoi}
                          </Link>
                        </span>
                      </li>
                    )}

                    {version.publicationDoi && (
                      <>
                        {version.preprintDoi && <Divider />}
                        <li css={additionalInformationEntryStyles}>
                          <strong>Publication DOI</strong>
                          <span css={additionalInformationValueStyles}>
                            <Link
                              href={new URL(
                                `https://doi.org/${version.publicationDoi}`,
                              ).toString()}
                            >
                              {version.publicationDoi}
                            </Link>
                          </span>
                        </li>
                      </>
                    )}
                    {version.requestingApcCoverage && (
                      <>
                        {(version.preprintDoi || version.publicationDoi) && (
                          <Divider />
                        )}
                        <li css={additionalInformationEntryStyles}>
                          <strong>Requesting APC Coverage?</strong>
                          <span css={additionalInformationValueStyles}>
                            {version.requestingApcCoverage}
                          </span>
                        </li>
                      </>
                    )}
                    {version.otherDetails && (
                      <>
                        {(version.preprintDoi ||
                          version.publicationDoi ||
                          version.requestingApcCoverage) && <Divider />}
                        <li css={additionalInformationEntryStyles}>
                          <strong>Other details</strong>
                          <span css={additionalInformationValueStyles}>
                            {version.otherDetails}
                          </span>
                        </li>
                      </>
                    )}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManuscriptCard;
