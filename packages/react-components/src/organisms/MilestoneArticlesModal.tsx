import { css } from '@emotion/react';
import { useState } from 'react';
import { ArticleItem } from '@asap-hub/model';

import { Modal } from '../molecules';
import { crossIcon } from '../icons';
import { Button, Headline3, Paragraph, Pill } from '../atoms';
import { paddingStyles } from '../card';
import { mobileScreen, rem } from '../pixels';
import * as colors from '../colors';

const headerStyles = css(paddingStyles, {
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
});

const controlsContainerStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
});

const bodyStyles = css(paddingStyles, {
  paddingTop: 0,
});

const searchContainerStyles = css({
  marginTop: rem(16),
  marginBottom: rem(16),
});

const searchInputStyles = css({
  width: '100%',
  padding: `${rem(10)} ${rem(12)}`,
  border: `1px solid ${colors.steel.rgb}`,
  borderRadius: rem(6),
  fontSize: rem(15),
  lineHeight: rem(24),
  color: colors.lead.rgb,
  outline: 'none',
  boxSizing: 'border-box',
  '&:focus': {
    borderColor: colors.info500.rgb,
  },
  '&::placeholder': {
    color: colors.neutral500.rgb,
  },
});

const chipsContainerStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(8),
  marginBottom: rem(24),
});

const chipStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(6),
  padding: `${rem(4)} ${rem(10)}`,
  backgroundColor: colors.neutral200.rgb,
  borderRadius: rem(24),
  fontSize: rem(14),
  lineHeight: rem(20),
  color: colors.neutral1000.rgb,
});

const chipRemoveButtonStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  color: colors.neutral800.rgb,
  '& svg': {
    width: rem(12),
    height: rem(12),
  },
  '&:hover': {
    color: colors.neutral1000.rgb,
  },
});

const buttonMediaQuery = `@media (min-width: ${mobileScreen.max - 100}px)`;

const buttonContainerStyles = css({
  display: 'grid',
  columnGap: rem(30),
  gridTemplateRows: 'max-content 12px max-content',
  [buttonMediaQuery]: {
    gridTemplateColumns: 'max-content max-content',
    gridTemplateRows: 'auto',
    justifyContent: 'flex-end',
  },
});

const confirmStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '1 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
    gridColumn: '2',
  },
});

const cancelStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gridRow: '2 / span 2',
  gridColumn: '1',
  [buttonMediaQuery]: {
    gridRow: '1',
  },
});

type MilestoneArticlesModalProps = {
  readonly articles: ReadonlyArray<ArticleItem>;
  readonly onClose: () => void;
  readonly onConfirm?: (articles: ReadonlyArray<ArticleItem>) => void;
};

const MilestoneArticlesModal: React.FC<MilestoneArticlesModalProps> = ({
  articles: initialArticles,
  onClose,
  onConfirm,
}) => {
  const [articles, setArticles] =
    useState<ReadonlyArray<ArticleItem>>(initialArticles);
  const hasArticles = initialArticles.length > 0;
  const title = hasArticles ? 'Edit Related Articles' : 'Add Related Articles';

  const handleRemoveArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId));
  };

  return (
    <Modal padding={false}>
      <header css={headerStyles}>
        <div css={controlsContainerStyles}>
          <Button small onClick={onClose}>
            {crossIcon}
          </Button>
        </div>
        <Headline3>{title}</Headline3>
      </header>
      <div css={bodyStyles}>
        <Paragraph accent="lead">
          Add any articles associated with this milestone. Only published
          articles on the CRN Hub will be available to select. These articles
          will also be displayed in the corresponding Aim.
        </Paragraph>

        <div css={searchContainerStyles}>
          <input
            css={searchInputStyles}
            type="text"
            placeholder="Start typing..."
            disabled
            aria-label="Search articles"
          />
        </div>

        {articles.length > 0 && (
          <div css={chipsContainerStyles}>
            {articles.map((article) => (
              <span key={article.id} css={chipStyles}>
                <span>{article.title}</span>
                {article.type && (
                  <Pill small accent="gray" noMargin>
                    {article.type}
                  </Pill>
                )}
                <button
                  type="button"
                  css={chipRemoveButtonStyles}
                  onClick={() => handleRemoveArticle(article.id)}
                  aria-label={`Remove ${article.title}`}
                >
                  {crossIcon}
                </button>
              </span>
            ))}
          </div>
        )}

        <div css={buttonContainerStyles}>
          <div css={cancelStyles}>
            <Button onClick={onClose}>Cancel</Button>
          </div>
          <div css={confirmStyles}>
            <Button
              primary
              enabled={!!onConfirm}
              onClick={() => onConfirm?.(articles)}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MilestoneArticlesModal;
