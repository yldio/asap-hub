import { Milestone as MilestoneType, MilestoneStatus } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { Button, Link, Pill } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import { steel, info100, info500 } from '../colors';
import { article as articleIcon, minusRectIcon, plusRectIcon } from '../icons';
import { useTextTruncation } from '../hooks';
import { noop, ResearchOutputOption } from '../utils';
import {
  descriptionContainerStyles,
  mobileLabelStyles,
  clampedDescriptionStyles,
  readMoreButtonStyles,
  statusContainerStyles,
  getStatusAccent,
  articlesHeaderStyles,
  articlesSeparatorStyles,
  articlesIconButtonStyles,
  articlesIconStyles,
  articlesTitleStyles,
  articlesListWrapperStyles,
  articlesListStyles,
  articlesItemStyles,
  articlesItemIconStyles,
  articlesItemTextContainerStyles,
  articlesItemLinkStyles,
  articlesWrapperStyles,
  noArticlesTextStyles,
  editButtonStyles,
} from './shared-aim-milestones-styles';
import MilestoneArticlesModal from './MilestoneArticlesModal';

function parseAimsString(aims: string | undefined): number[] {
  if (!aims || typeof aims !== 'string') return [];
  return aims
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

const milestoneRowStyles = css({
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
  paddingBottom: rem(20),
  borderBottom: `1px solid ${steel.rgb}`,
  marginBottom: rem(20),
  alignItems: 'flex-start',
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    gridTemplateColumns: '1fr',
    gap: rem(12),
  },
  '&:last-child': {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none',
  },
});

const aimsColumnStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(8),
  alignItems: 'center',
  paddingBlock: rem(4),
});

const aimBadgeStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: info100.rgb,
  color: info500.rgb,
  fontSize: rem(14),
  padding: `${rem(2)} ${rem(6)}`,
  lineHeight: rem(16),
  borderRadius: rem(24),
  height: rem(24),
  width: rem(32),
  whiteSpace: 'nowrap',
});

export const getMilestoneStatusAccent = (
  status: MilestoneStatus,
): 'success' | 'info' | 'neutral' | 'warning' | 'error' | 'default' =>
  getStatusAccent(status);

type MilestoneProps = {
  milestone: MilestoneType;
  isLead: boolean;
  loadArticleOptions: (inputValue: string) => Promise<ResearchOutputOption[]>;
};

const Milestone: FC<MilestoneProps> = ({
  milestone,
  isLead,
  loadArticleOptions,
}) => {
  const { ref, isExpanded, needsExpansion, toggle } = useTextTruncation(
    milestone.description,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArticlesExpanded, setIsArticlesExpanded] = useState(false);

  const aimNumbers = parseAimsString(milestone.aims);
  const articles = milestone.relatedArticles ?? [];
  const articleCount = articles.length;

  return (
    <div css={milestoneRowStyles}>
      <div css={aimsColumnStyles}>
        <div css={mobileLabelStyles}>Aims</div>
        {aimNumbers.length > 0 &&
          aimNumbers.map((n) => (
            <span key={n} css={aimBadgeStyles}>
              #{n}
            </span>
          ))}
      </div>
      <div css={descriptionContainerStyles}>
        <div css={mobileLabelStyles}>Milestone</div>
        <div>
          <div ref={ref} css={clampedDescriptionStyles(isExpanded)}>
            {milestone.description}
          </div>
          {(needsExpansion || isExpanded) && (
            <button type="button" css={readMoreButtonStyles} onClick={toggle}>
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
        <div css={articlesWrapperStyles}>
          {articleCount === 0 ? (
            <div css={articlesHeaderStyles}>
              <span css={noArticlesTextStyles}>No articles added</span>
              {isLead && (
                <>
                  <span css={articlesSeparatorStyles}>&middot;</span>
                  <Button
                    linkStyle
                    onClick={() => setIsModalOpen(true)}
                    overrideStyles={editButtonStyles}
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div>
              <div css={articlesHeaderStyles}>
                <Button
                  aria-label={
                    isArticlesExpanded ? 'Collapse articles' : 'Expand articles'
                  }
                  linkStyle
                  onClick={() => setIsArticlesExpanded(!isArticlesExpanded)}
                  overrideStyles={articlesIconButtonStyles}
                >
                  <span css={articlesIconStyles}>
                    {isArticlesExpanded ? minusRectIcon : plusRectIcon}
                  </span>
                  <span css={articlesTitleStyles}>
                    Articles ({articleCount})
                  </span>
                </Button>
                {isLead && (
                  <>
                    <span css={articlesSeparatorStyles}>•</span>
                    <Button
                      linkStyle
                      onClick={() => setIsModalOpen(true)}
                      overrideStyles={editButtonStyles}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
              {isArticlesExpanded && (
                <div css={articlesListWrapperStyles(rem(240), rem(408))}>
                  <ul css={articlesListStyles}>
                    {articles.map(({ id, title, href }) => (
                      <li key={id} css={articlesItemStyles}>
                        <span css={articlesItemIconStyles} aria-hidden>
                          {articleIcon}
                        </span>
                        <span css={articlesItemTextContainerStyles}>
                          <Link href={href}>
                            <span css={articlesItemLinkStyles}>{title}</span>
                          </Link>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div css={statusContainerStyles}>
        <div css={mobileLabelStyles}>Status</div>
        <Pill accent={getMilestoneStatusAccent(milestone.status)} noMargin>
          {milestone.status}
        </Pill>
      </div>
      {isModalOpen && (
        <MilestoneArticlesModal
          articles={articles}
          onClose={() => setIsModalOpen(false)}
          onConfirm={noop}
          loadOptions={loadArticleOptions}
        />
      )}
    </div>
  );
};

export default Milestone;
