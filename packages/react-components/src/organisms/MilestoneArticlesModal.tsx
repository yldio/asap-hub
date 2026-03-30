import { css } from '@emotion/react';
import { useState } from 'react';
import { ArticleItem, ResearchOutputType } from '@asap-hub/model';

import { LabeledMultiSelect, Modal } from '../molecules';
import { article as articleIcon, crossIcon } from '../icons';
import { Button, Headline3, Paragraph } from '../atoms';
import { paddingStyles } from '../card';
import { mobileScreen, rem } from '../pixels';
import { ResearchOutputOption } from '../utils';
import { createArticleSelectComponents } from '../utils/article-select-components';

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

const selectContainerStyles = css({
  marginTop: rem(16),
  marginBottom: rem(24),
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

const articlesToOptions = (
  articles: ReadonlyArray<ArticleItem>,
): ResearchOutputOption[] =>
  articles.map((a) => ({
    value: a.id,
    label: a.title,
    documentType: 'Article',
    type: a.type,
  }));

const optionsToArticles = (
  options: ReadonlyArray<ResearchOutputOption>,
): ReadonlyArray<ArticleItem> =>
  options.map((o) => ({
    id: o.value,
    title: o.label,
    href: '',
    type: o.type as ResearchOutputType | undefined,
  }));

type MilestoneArticlesModalProps = {
  readonly articles: ReadonlyArray<ArticleItem>;
  readonly onClose: () => void;
  readonly onConfirm: (articles: ReadonlyArray<ArticleItem>) => void;
  readonly loadOptions: (inputValue: string) => Promise<ResearchOutputOption[]>;
};

const MilestoneArticlesModal: React.FC<MilestoneArticlesModalProps> = ({
  articles: initialArticles,
  onClose,
  onConfirm,
  loadOptions,
}) => {
  const articleSelectComponents =
    createArticleSelectComponents<ResearchOutputOption>({
      getIcon: () => articleIcon,
      showArticlePill: (data) => !!data.type,
    });
  const [selectedOptions, setSelectedOptions] = useState<
    ResearchOutputOption[]
  >(articlesToOptions(initialArticles));
  const hasArticles = initialArticles.length > 0;
  const title = hasArticles ? 'Edit Related Articles' : 'Add Related Articles';

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

        <div css={selectContainerStyles}>
          <LabeledMultiSelect<ResearchOutputOption>
            title=""
            description=""
            placeholder="Start typing..."
            values={selectedOptions}
            loadOptions={loadOptions}
            onChange={(newValues) => setSelectedOptions([...newValues])}
            noOptionsMessage={() => 'No articles found'}
            components={articleSelectComponents}
          />
        </div>

        <div css={buttonContainerStyles}>
          <div css={cancelStyles}>
            <Button onClick={onClose}>Cancel</Button>
          </div>
          <div css={confirmStyles}>
            <Button
              primary
              onClick={() => onConfirm(optionsToArticles(selectedOptions))}
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
