import { Aim as AimType, AimStatus, ArticleItem } from '@asap-hub/model';
import { css } from '@emotion/react';
import { FC } from 'react';
import { Button, Pill } from '../atoms';
import { rem, tabletScreen } from '../pixels';
import { info100, info500, neutral900, steel } from '../colors';
import { useTextTruncation } from '../hooks';
import {
  descriptionContainerStyles,
  mobileLabelStyles,
  clampedDescriptionStyles,
  readMoreButtonStyles,
  statusContainerStyles,
  getStatusAccent,
} from './shared-aim-milestones-styles';
import { ArticlesList } from '../molecules';
import { noop } from '../utils';

const aimRowStyles = css({
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
  paddingBottom: rem(20),
  borderBottom: `1px solid ${steel.rgb}`,
  marginBottom: rem(20),
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    gridColumn: 'auto',
    gridTemplateColumns: '1fr',
    gap: rem(24),
  },
  '&:last-child': {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none',
  },
});

const noArticlesWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: rem(12),
});

const articlesWrapperStyles = css({
  marginTop: rem(4),
});

const noArticlesTextStyles = css({
  fontStyle: 'italic',
  fontSize: rem(17),
  lineHeight: rem(26),
  color: neutral900.rgb,
});

const noArticlesSeparatorStyles = css({
  color: neutral900.rgb,
  fontSize: rem(17),
});

const noArticlesEditButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  padding: 0,
  minWidth: 'auto',
  gap: rem(16),
  textDecoration: 'none',
  ':hover, :active, :focus': {
    textDecoration: 'none',
  },
});

const aimNumberContainerStyles = css({
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'start',
  placeSelf: 'start',
  justifyContent: 'center',
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    gap: rem(16),
    justifyContent: 'flex-start',
    flexFlow: 'column',
  },
});

const aimNumberBadgeStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: info100.rgb,
  color: info500.rgb,
  fontSize: rem(14),
  borderRadius: rem(12),
  height: rem(24),
  padding: `0 ${rem(8)}`,
  whiteSpace: 'nowrap',
});

export const getAimStatusAccent = (status: AimStatus) =>
  getStatusAccent(status);

type AimProps = {
  aim: AimType;
  fetchArticles: (aimId: string) => Promise<ReadonlyArray<ArticleItem>>;
};

const Aim: FC<AimProps> = ({ aim, fetchArticles }) => {
  const { ref, isExpanded, needsExpansion, toggle } = useTextTruncation(
    aim.description,
  );

  return (
    <div css={aimRowStyles}>
      <div css={aimNumberContainerStyles}>
        <div css={mobileLabelStyles}>Aim</div>
        <span css={aimNumberBadgeStyles}>#{aim.order}</span>
      </div>
      <div css={descriptionContainerStyles}>
        <div css={mobileLabelStyles}>Description</div>
        <div>
          <div ref={ref} css={clampedDescriptionStyles(isExpanded)}>
            {aim.description}
          </div>
          {(needsExpansion || isExpanded) && (
            <button type="button" css={readMoreButtonStyles} onClick={toggle}>
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
        <div css={articlesWrapperStyles}>
          {aim.articleCount === 0 ? (
            <div css={noArticlesWrapperStyles}>
              <span css={noArticlesTextStyles}>No articles added</span>
              <span css={noArticlesSeparatorStyles}>•</span>
              <Button
                id={`aim-articles-edit-${aim.id}`}
                linkStyle
                onClick={noop}
                overrideStyles={noArticlesEditButtonStyles}
              >
                Edit
              </Button>
            </div>
          ) : (
            <ArticlesList
              aimId={aim.id}
              articlesCount={aim.articleCount}
              fetchArticles={fetchArticles}
            />
          )}
        </div>
      </div>
      <div css={statusContainerStyles}>
        <div css={mobileLabelStyles}>Status</div>
        <Pill accent={getAimStatusAccent(aim.status)} noMargin>
          {aim.status}
        </Pill>
      </div>
    </div>
  );
};

export default Aim;
