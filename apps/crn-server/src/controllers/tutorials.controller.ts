import { NotFoundError } from '@asap-hub/errors';
import { TutorialsResponse } from '@asap-hub/model';
import { TutorialsDataProvider } from '../data-providers/types';

export default class TutorialController {
  tutorialsDataProvider: TutorialsDataProvider;

  constructor(tutorialsDataProvider: TutorialsDataProvider) {
    this.tutorialsDataProvider = tutorialsDataProvider;
  }

  async fetchById(id: string): Promise<TutorialsResponse> {
    const tutorial = await this.tutorialsDataProvider.fetchById(id);

    if (!tutorial) {
      throw new NotFoundError(undefined, `tutorial with id ${id} not found`);
    }

    return tutorial;
  }
}
