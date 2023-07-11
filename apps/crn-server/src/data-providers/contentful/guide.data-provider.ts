import {
  GuideContentDataObject,
  GuideDataObject,
  ListGuideResponse,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_GUIDE_BY_TITLE,
  FetchGuideByTitleQuery,
  GuideContent,
  Maybe,
  Guides,
} from '@asap-hub/contentful';
import { GuideDataProvider } from '../types';
import reducer from '../../utils/reducer';

type GuideItem = Pick<Guides, 'title'> & {
  contentCollection?:
    | Maybe<{
        items: Maybe<
          Pick<GuideContent, 'title' | 'text' | 'linkUrl' | 'linkText'>
        >[];
      }>
    | undefined;
};

type GuideContentItem = NonNullable<
  Pick<GuideContent, 'text' | 'title' | 'linkUrl' | 'linkText'>[]
>[number];

export class GuideContentfulDataProvider implements GuideDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchByCollectionTitle(title: string): Promise<ListGuideResponse> {
    const { guideCollectionsCollection } =
      await this.contentfulClient.request<FetchGuideByTitleQuery>(
        FETCH_GUIDE_BY_TITLE,
        { title },
      );

    const guides =
      guideCollectionsCollection?.items[0]?.guidesCollection?.items || [];

    return {
      items: parseGraphQLGuides(guides),
      total: guides.length,
    };
  }
}

const parseGuideContent = (
  guideContent: GuideContentItem | null,
): GuideContentDataObject => ({
  text: guideContent?.text || '',
  title: guideContent?.title || '',
  linkUrl: guideContent?.linkUrl || '',
  linkText: guideContent?.linkText || '',
});

const reduceContent = reducer<GuideContentItem | null, GuideContentDataObject>(
  parseGuideContent,
);

export const parseGraphQLGuide = (guide: GuideItem): GuideDataObject => ({
  title: guide?.title ? guide.title : '',
  content: guide?.contentCollection
    ? guide.contentCollection.items.reduce(reduceContent, [])
    : [],
});

const reduceGuides = reducer<GuideItem | null, GuideDataObject>(
  parseGraphQLGuide,
);

const parseGraphQLGuides = (
  guides: Maybe<GuideItem | null>[],
): GuideDataObject[] => guides.reduce(reduceGuides, []);
