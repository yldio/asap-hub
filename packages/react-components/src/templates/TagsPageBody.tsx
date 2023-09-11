import { ListResearchOutputResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { Headline3, Paragraph } from '../atoms';
import { charcoal } from '../colors';
import { tagsIcon } from '../icons';
import { ResultList, SharedResearchCard } from '../organisms';
import { perRem } from '../pixels';

const wrapperStyle = css({
  textAlign: 'center',
});

const iconStyles = css({
  svg: {
    width: `${48 / perRem}em`,
    height: `${48 / perRem}em`,
    fill: charcoal.rgb,
  },
});

const MessageBody: React.FC<{ title: string; body: string }> = ({
  title,
  body,
}) => (
  <main css={wrapperStyle}>
    <span css={iconStyles}>{tagsIcon}</span>
    <Headline3>{title}</Headline3>
    <Paragraph accent="lead">{body}</Paragraph>
  </main>
);

interface TagsPageBodyProps {
  readonly results: ListResearchOutputResponse['items'];
  readonly numberOfItems: number;
  readonly numberOfPages: number;
  readonly currentPage: number;
  readonly renderPageHref: (idx: number) => string;
}

const TagsPageBody: React.FC<TagsPageBodyProps> = ({
  results,
  numberOfItems,
  numberOfPages,
  currentPage,
  renderPageHref,
}) => (
  <ResultList
    numberOfPages={numberOfPages}
    numberOfItems={numberOfItems}
    currentPageIndex={currentPage}
    renderPageHref={renderPageHref}
    noResultsComponent={
      <MessageBody
        title="Explore any tags on the CRN Hub."
        body="All CRN Hub research outputs with the selected tags will be listed on this page."
      />
    }
  >
    {results.map((data) => (
      <div key={data.id}>
        <SharedResearchCard {...data} />
      </div>
    ))}
  </ResultList>
);

export default TagsPageBody;
