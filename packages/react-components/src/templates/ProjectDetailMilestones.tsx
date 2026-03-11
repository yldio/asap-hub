import { ComponentProps, useState } from 'react';
import { css } from '@emotion/react';
import { Milestone as MilestoneType } from '@asap-hub/model';

import { Headline3, Link, Paragraph } from '../atoms';
import { LabeledDropdown, PageControls } from '../molecules';
import { ExternalLinkIcon } from '../icons';
import ProjectMilestones from '../organisms/ProjectMilestones';
import { rem } from '../pixels';
import { neutral1000 } from '../colors';

const containerStyles = css({
  display: 'grid',
  rowGap: rem(56),
});

const descriptionSectionStyles = css({
  // maxWidth: rem(720),
  display: 'block',
  '& > * + *': {
    marginTop: rem(16),
  },
});

const seeAimsButtonContainerStyles = css({
  marginTop: rem(16),
});

const seeAimsIconStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: rem(8),
});

const aimsLinkTextStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: 0,
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
  paddingTop: rem(36),
  paddingBottom: rem(36),
});

type GrantType = 'original' | 'supplement';

type ProjectDetailMilestonesProps = {
  readonly milestones: ReadonlyArray<MilestoneType>;
  readonly seeAimsHref?: string;
  // } & ComponentProps<typeof PageControls>; // TODO: Add this back when we have actual page controls props
  readonly pageControlsProps?: ComponentProps<typeof PageControls>;
};

const ProjectDetailMilestones: React.FC<ProjectDetailMilestonesProps> = ({
  milestones,
  seeAimsHref,
  // ...pageControlProps // TODO: Add this back when we have actual page controls props
  pageControlsProps,
}) => {
  const hasMilestones = milestones.length > 0;
  const [selectedGrantType, setSelectedGrantType] =
    useState<GrantType>('original');

  const grantLabel =
    selectedGrantType === 'supplement' ? 'Supplement' : 'Original';

  return (
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
      />

      <div css={descriptionSectionStyles}>
        <Headline3 noMargin>Milestones</Headline3>
        <Paragraph accent="lead">
          These milestones track progress toward the objectives of the{' '}
          {grantLabel} Grant through defined deliverables and timelines. Each
          milestone supports one or more related aims.
        </Paragraph>
        <Paragraph accent="lead">
          Articles associated with a milestone may be added at any status. When
          a milestone is marked as complete, the resulting article(s) are
          expected to be included. These articles are linked to their
          corresponding aims and are displayed in the Aims section.
        </Paragraph>
        <div css={seeAimsButtonContainerStyles}>
          <Link buttonStyle small href={seeAimsHref ?? '#'} noMargin>
            <div css={aimsLinkTextStyles}>
              See Aims
              <span css={seeAimsIconStyles}>
                <ExternalLinkIcon />
              </span>
            </div>
          </Link>
        </div>
        {!hasMilestones && (
          <Paragraph accent="lead" noMargin styles={noMilestonesTextStyles}>
            No milestones related to the {grantLabel} Grant have been added to
            this project yet.
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
  );
};

export default ProjectDetailMilestones;
