import { GuideDataObject } from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_GUIDE,
  FetchGuideQuery,
} from '@asap-hub/contentful';
import { GuideDataProvider } from '../types';

type GuideItem = NonNullable<
  NonNullable<FetchGuideQuery['guideCollection']>['items']
>[number];

type GuideContentItem = NonNullable<
  NonNullable<FetchGuideQuery['guideContentCollection']>['items']
>[number];

export class GuideContentfulDataProvider implements GuideDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(): Promise<GuideDataObject> {
    const { guideCollection } =
      await this.contentfulClient.request<FetchGuideQuery>(FETCH_GUIDE);

    return parseGraphQLGuide(guideCollection?.items[0] || null);
  }
}
const parseGuideContent = (guideContent: GuideContentItem | null) => ({
  text:'',
  title: '',
  linkURL: '',
  linkText: '',
});

const parseGraphQLGuide= (
  guide: GuideItem | null,
): GuideDataObject => ({
  content: guide?.content
    ? parseGuideContent(guide.content)
    : '',
});
