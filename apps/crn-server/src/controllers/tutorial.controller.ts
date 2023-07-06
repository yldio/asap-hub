import { NotFoundError } from '@asap-hub/errors';
import { TutorialsResponse } from '@asap-hub/model';
import { TutorialDataProvider } from '../data-providers/types';

export default class TutorialController {
  tutorialsDataProvider: TutorialDataProvider;

  constructor(tutorialsDataProvider: TutorialDataProvider) {
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
