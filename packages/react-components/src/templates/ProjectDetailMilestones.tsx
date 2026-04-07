import { ComponentProps, useState } from 'react';
import { css } from '@emotion/react';
import {
  Aim,
  Milestone as MilestoneType,
  MilestoneCreateRequest,
  GrantType,
} from '@asap-hub/model';
import type { ResearchOutputOption } from '../utils';

import { Button, Headline3, Link, Paragraph } from '../atoms';
import { LabeledDropdown, PageControls } from '../molecules';
import { plusIcon } from '../icons';
import ProjectMilestones from '../organisms/ProjectMilestones';
import MilestoneForm from '../organisms/MilestoneForm';
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

const addButtonContainerStyles = css({
  display: 'flex',
  justifyContent: 'flex-end',
});

type ProjectDetailMilestonesProps = {
  readonly milestones: ReadonlyArray<MilestoneType>;
  readonly seeAimsHref?: string;
  readonly pageControlsProps?: ComponentProps<typeof PageControls>;
  readonly hasSupplementGrant?: boolean;
  readonly isLead?: boolean;
  readonly loadArticleOptions?: (
    inputValue: string,
  ) => Promise<ResearchOutputOption[]>;
  readonly originalGrantAims?: ReadonlyArray<Aim>;
  readonly supplementGrantAims?: ReadonlyArray<Aim>;
  readonly onCreateMilestone?: (
    data: MilestoneCreateRequest,
  ) => Promise<unknown>;
  readonly getArticleSuggestions?: ComponentProps<
    typeof MilestoneForm
  >['getArticleSuggestions'];
};

const ProjectDetailMilestones: React.FC<ProjectDetailMilestonesProps> = ({
  milestones,
  seeAimsHref,
  pageControlsProps,
  hasSupplementGrant = false,
  isLead = false,
  loadArticleOptions,
  originalGrantAims = [],
  supplementGrantAims = [],
  onCreateMilestone,
  getArticleSuggestions,
}) => {
  const hasMilestones = milestones.length > 0;
  const [selectedGrantType, setSelectedGrantType] = useState<GrantType>(
    hasSupplementGrant ? 'supplement' : 'original',
  );
  const [showForm, setShowForm] = useState(false);

  const grantLabel =
    selectedGrantType === 'supplement' ? 'Supplement' : 'Original';

  const formGrantType = hasSupplementGrant ? 'supplement' : selectedGrantType;
  const formAims =
    formGrantType === 'supplement' ? supplementGrantAims : originalGrantAims;

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

          {isLead && onCreateMilestone && (
            <div css={addButtonContainerStyles}>
              <Button onClick={() => setShowForm(true)}>
                {plusIcon} Add New Milestone
              </Button>
            </div>
          )}

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
              <ProjectMilestones
                milestones={milestones}
                isLead={isLead}
                loadArticleOptions={loadArticleOptions}
              />
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
      {showForm && onCreateMilestone && (
        <MilestoneForm
          grantType={formGrantType}
          aims={formAims}
          getArticleSuggestions={getArticleSuggestions}
          onSubmit={async (data) => {
            await onCreateMilestone(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </>
  );
};

export default ProjectDetailMilestones;
