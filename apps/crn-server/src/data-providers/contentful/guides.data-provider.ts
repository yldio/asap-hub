import {
  GuideContentDataObject,
  GuideDataObject,
  ListGuideResponse,
} from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_GUIDE,
  FetchGuideQuery,
  GuideContent,
} from '@asap-hub/contentful';
import { GuideDataProvider } from '../types';
import reducer from '../../utils/reducer';

type GuideItem = NonNullable<
  NonNullable<FetchGuideQuery['guidesCollection']>['items']
>[number];

type GuideContentItem = NonNullable<
  Pick<GuideContent, 'text' | 'title' | 'linkUrl' | 'linkText'>[]
>[number];

export class GuideContentfulDataProvider implements GuideDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(): Promise<ListGuideResponse> {
    const { guidesCollection } =
      await this.contentfulClient.request<FetchGuideQuery>(FETCH_GUIDE);
    return {
      items: parseGraphQLGuides(guidesCollection?.items || []),
      total: guidesCollection?.items.length || 0,
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

const parseGraphQLGuides = (guides: GuideItem[]): GuideDataObject[] =>
  guides.map((guide) => parseGraphQLGuide(guide));
