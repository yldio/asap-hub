import { FC, useEffect, useState } from 'react';

import type { ArticleItem } from '@asap-hub/model';

import { Button, Link } from '../atoms';
import { article as articleIcon, minusRectIcon, plusRectIcon } from '../icons';
import { rem } from '../pixels';
import {
  articlesHeaderStyles,
  articlesIconButtonStyles,
  articlesIconStyles,
  articlesItemIconStyles,
  articlesItemLinkStyles,
  articlesItemStyles,
  articlesItemTextContainerStyles,
  articlesListStyles,
  articlesListWrapperStyles,
  articlesTitleStyles,
} from '../organisms/shared-aim-milestones-styles';

export type ArticlesListProps = {
  readonly aimId: string;
  readonly articlesCount?: number;
  readonly initiallyExpanded?: boolean;
  readonly listMaxHeight?: string;
  readonly maxWidth?: string;
  readonly fetchArticles: (
    aimId: string,
  ) => Promise<ReadonlyArray<ArticleItem>>;
};

const ArticlesList: FC<ArticlesListProps> = ({
  initiallyExpanded = false,
  listMaxHeight = rem(264),
  maxWidth = rem(408),
  articlesCount = 0,
  aimId,
  fetchArticles,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [articles, setArticles] = useState<ReadonlyArray<ArticleItem>>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (initiallyExpanded) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchArticles(aimId).then((result) => {
        setArticles(result);
        setHasFetched(true);
      });
    }
  }, [aimId, initiallyExpanded, fetchArticles]);

  const displayedCount = hasFetched ? articles.length : articlesCount;

  return (
    <div>
      <div css={articlesHeaderStyles}>
        <Button
          id={`articles-list-button-${aimId}`}
          aria-label={expanded ? 'Collapse articles' : 'Expand articles'}
          linkStyle
          onClick={async () => {
            const nextExpanded = !expanded;
            setExpanded(nextExpanded);
            if (nextExpanded) {
              const result = await fetchArticles(aimId);
              setArticles(result);
              setHasFetched(true);
            }
          }}
          overrideStyles={articlesIconButtonStyles}
        >
          <span css={articlesIconStyles}>
            {expanded ? minusRectIcon : plusRectIcon}
          </span>
          <span css={articlesTitleStyles}>Articles ({displayedCount})</span>
        </Button>
      </div>
      {expanded && articles?.length > 0 && (
        <div css={articlesListWrapperStyles(listMaxHeight, maxWidth)}>
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
  );
};

export default ArticlesList;
