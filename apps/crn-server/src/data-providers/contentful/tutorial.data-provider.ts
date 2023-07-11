import { ListResponse, TutorialsDataObject } from '@asap-hub/model';
import {
  GraphQLClient,
  FETCH_TUTORIAL_BY_ID,
  FetchTutorialByIdQuery,
  FetchTutorialByIdQueryVariables,
  parseRichText,
  RichTextFromQuery,
} from '@asap-hub/contentful';
import { TutorialDataProvider } from '../types';

type TutorialItem = NonNullable<FetchTutorialByIdQuery['tutorials']>;

export class TutorialContentfulDataProvider implements TutorialDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(): Promise<ListResponse<TutorialsDataObject>> {
    throw new Error('Method not implemented.');
  }

  async fetchById(id: string): Promise<TutorialsDataObject | null> {
    const { tutorials } = await this.contentfulClient.request<
      FetchTutorialByIdQuery,
      FetchTutorialByIdQueryVariables
    >(FETCH_TUTORIAL_BY_ID, { id });

    if (!tutorials) {
      return null;
    }

    return parseContentfulGraphQlTutorials(tutorials);
  }
}

export const parseContentfulGraphQlTutorials = (
  tutorial: TutorialItem,
): TutorialsDataObject => ({
  id: tutorial.sys.id,
  created: tutorial.sys.firstPublishedAt,
  title: tutorial.title || '',
  text: tutorial.text
    ? parseRichText(tutorial.text as RichTextFromQuery)
    : undefined,
  shortText: tutorial.shortText || undefined,
  link: tutorial.link || undefined,
  linkText: tutorial.linkText || undefined,
  thumbnail: tutorial.thumbnail?.url || undefined,
});
