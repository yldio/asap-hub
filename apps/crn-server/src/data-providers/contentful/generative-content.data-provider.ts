import { OpenAI } from 'openai';
import { openaiApiKey } from '../../config';

export class GenerativeContentDataProvider {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: openaiApiKey,
    });
  }

  async summariseContent(content: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that summarises text in under 230 characters, including spaces. You will return nothing but a summary of the given text and your summary cannot exceed 230 characters.',
        },
        {
          role: 'user',
          content,
        },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    const summary = response.choices[0]?.message.content?.trim();

    return summary || '';
  }
}

export const generativeContentDataProviderNoop = {
  async summariseContent() {
    return '';
  },
} as unknown as GenerativeContentDataProvider;
