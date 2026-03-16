import { ComponentProps, useState } from 'react';
import { css } from '@emotion/react';
import { Milestone as MilestoneType } from '@asap-hub/model';

import { Headline3, Link, Paragraph } from '../atoms';
import { LabeledDropdown, PageControls } from '../molecules';
import ProjectMilestones from '../organisms/ProjectMilestones';
import { rem, mobileScreen } from '../pixels';
import { neutral1000 } from '../colors';
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

const noMilestonesTextStyles = css({
  fontSize: rem(17),
  lineHeight: rem(24),
  fontWeight: 700,
  color: neutral1000.rgb,
  marginTop: rem(16),
});

const pageControlsStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: rem(16),
  paddingBottom: rem(36),
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

type GrantType = 'original' | 'supplement';

type ProjectDetailMilestonesProps = {
  readonly milestones: ReadonlyArray<MilestoneType>;
  readonly seeAimsHref?: string;
  readonly pageControlsProps?: ComponentProps<typeof PageControls>;
  readonly hasSupplementGrant?: boolean;
};

const ProjectDetailMilestones: React.FC<ProjectDetailMilestonesProps> = ({
  milestones,
  seeAimsHref,
  // ...pageControlProps // TODO: Add this back when we have actual page controls props
  pageControlsProps,
  hasSupplementGrant = false,
}) => {
  const hasMilestones = milestones.length > 0;
  const [selectedGrantType, setSelectedGrantType] = useState<GrantType>(
    hasSupplementGrant ? 'supplement' : 'original',
  );

  const grantLabel =
    selectedGrantType === 'supplement' ? 'Supplement' : 'Original';

  return (
    <>
      <div css={pageDesktopStyles}>
        <div css={containerStyles}>
          <LabeledDropdown<GrantType>
            title="Grant Type"
            enabled={hasMilestones}
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
            onChange={setSelectedGrantType}
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
            {!hasMilestones && (
              <Paragraph accent="lead" noMargin styles={noMilestonesTextStyles}>
                No milestones related to the {grantLabel} Grant have been added
                to this project yet.
              </Paragraph>
            )}
          </div>

          {hasMilestones && pageControlsProps && (
            <>
              <ProjectMilestones milestones={milestones} />
              <section css={pageControlsStyles}>
                <PageControls {...pageControlsProps} />
              </section>
            </>
          )}
        </div>
      </div>
      <div css={pageMobileStyles}>
        <MilestonesMobilePage />
      </div>
    </>
  );
};

export default ProjectDetailMilestones;
