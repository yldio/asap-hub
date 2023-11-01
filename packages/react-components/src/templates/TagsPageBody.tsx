import { CRNTagSearchEntities } from '@asap-hub/algolia';
import {
  ListEventResponse,
  ListResearchOutputResponse,
  ListUserResponse,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { Headline3, Paragraph } from '../atoms';
import { charcoal } from '../colors';
import { tagsIcon } from '../icons';
import {
  EventCard,
  PeopleCard,
  ResultList,
  SharedResearchCard,
} from '../organisms';
import { perRem } from '../pixels';
import { eventMapper } from '..';

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

export enum TagFieldByEntity {
  'research-output' = 'keywords',
  user = 'expertiseAndResourceTags',
  event = 'calendar',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assert = <T extends never>() => undefined;
type TypeEqualityGuard<A, B> = Exclude<A, B> | Exclude<B, A>;

const EntityCard: React.FC<TagsPageBodyProps['results'][number]> = ({
  ...data
}): JSX.Element => {
  assert<
    TypeEqualityGuard<keyof typeof TagFieldByEntity, CRNTagSearchEntities>
  >;

  if (TagFieldByEntity['research-output'] in data) {
    return <SharedResearchCard {...data} />;
  }

  if (TagFieldByEntity.user in data) {
    return <PeopleCard {...data} />;
  }

  return <EventCard {...eventMapper(data)} />;
};

interface TagsPageBodyProps {
  readonly results: (
    | ListUserResponse['items'][number]
    | ListResearchOutputResponse['items'][number]
    | ListEventResponse['items'][number]
  )[];
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
        <EntityCard {...data} />
      </div>
    ))}
  </ResultList>
);

export default TagsPageBody;
