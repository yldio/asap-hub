import {
  ContentGeneratorRequest,
  ContentGeneratorResponse,
} from '@asap-hub/model';
import { GenerativeContentDataProvider } from '../data-providers/contentful/generative-content.data-provider';

export default class ContentGeneratorController {
  constructor(
    private generativeContentDataProvider: GenerativeContentDataProvider,
  ) {}

  async generateContent(
    data: ContentGeneratorRequest,
  ): Promise<ContentGeneratorResponse> {
    if (!data.description) {
      return {
        shortDescription: '',
      };
    }

    const shortDescription =
      await this.generativeContentDataProvider.summariseContent(
        data.description,
      );

    return {
      shortDescription,
    };
  }
}
