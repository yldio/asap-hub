import { css } from '@emotion/react';
import { GrantType } from '@asap-hub/model';

import { Headline3, Link, Paragraph } from '../atoms';
import { formatDateToTimezone } from '../date';
import { LabeledDropdown } from '../molecules';
import { rem, mobileScreen } from '../pixels';
import { neutral900 } from '../colors';
import MilestonesMobilePage from './MilestonesMobilePage';

const containerStyles = css({
  display: 'grid',
  rowGap: rem(32),
});

const descriptionSectionStyles = css({
  display: 'block',
  marginTop: rem(24),
  '& > * + *': {
    marginTop: rem(16),
  },
});

const aimsLinkTextStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: 0,
  '&:hover': {
    textDecoration: 'underline',
  },
});

const lastUpdatedBarStyles = css({
  display: 'flex',
  alignItems: 'center',
  color: neutral900.rgb,
});

const pageMobileStyles = css({
  [`@media (min-width: ${mobileScreen.max}px)`]: {
    display: 'none',
  },
});

const pageDesktopStyles = css({
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    display: 'none',
  },
});

type ProjectDetailMilestonesProps = {
  readonly seeAimsHref?: string;
  selectedGrantType: GrantType;
  onGrantTypeChange: (grantType: GrantType) => void;
  children: React.ReactNode;
  hasSupplementGrant: boolean;
  readonly lastUpdated?: string;
};

const ProjectDetailMilestones: React.FC<ProjectDetailMilestonesProps> = ({
  seeAimsHref,
  selectedGrantType,
  onGrantTypeChange,
  hasSupplementGrant,
  children,
  lastUpdated,
}) => {
  const grantLabel =
    selectedGrantType === 'supplement' ? 'Supplement' : 'Original';

  return (
    <>
      <div css={pageDesktopStyles}>
        <div css={containerStyles}>
          <LabeledDropdown<GrantType>
            title="Grant Type"
            enabled={hasSupplementGrant}
            value={selectedGrantType}
            options={[
              {
                label: 'Original',
                value: 'original',
              },
              {
                label: 'Supplement',
                value: 'supplement',
              },
            ]}
            onChange={onGrantTypeChange}
            required={true}
          />

          <div css={descriptionSectionStyles}>
            <Headline3 noMargin>Milestones</Headline3>
            <Paragraph accent="lead">
              These milestones track progress toward the objectives of the{' '}
              {grantLabel} Grant through defined deliverables and timelines.
              Each milestone supports one or more related aims.
            </Paragraph>
            <Paragraph accent="lead">
              Articles associated with a milestone may be added at any status.
              When a milestone is marked as complete, the resulting article(s)
              are expected to be included. These articles are linked to their
              corresponding aims and are displayed in the Aims section.
            </Paragraph>
            <Link href={seeAimsHref ?? '#'} underlined>
              <span css={aimsLinkTextStyles}>See Aims</span>
            </Link>
            {lastUpdated && (
              <div css={lastUpdatedBarStyles}>
                <span>
                  Last Update:{' '}
                  {formatDateToTimezone(
                    lastUpdated,
                    'do MMMM yyyy, h:mm aaa (z)',
                  )}
                </span>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
      <div css={pageMobileStyles}>
        <MilestonesMobilePage />
      </div>
    </>
  );
};

export default ProjectDetailMilestones;
