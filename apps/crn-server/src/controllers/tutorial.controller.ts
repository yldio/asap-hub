import { NotFoundError } from '@asap-hub/errors';
import { TutorialsResponse } from '@asap-hub/model';
import { TutorialDataProvider } from '../data-providers/types';

export default class TutorialController {
  tutorialDataProvider: TutorialDataProvider;

  constructor(tutorialsDataProvider: TutorialDataProvider) {
    this.tutorialDataProvider = tutorialsDataProvider;
  }

  async fetchById(id: string): Promise<TutorialsResponse> {
    const tutorial = await this.tutorialDataProvider.fetchById(id);

    if (!tutorial) {
      throw new NotFoundError(undefined, `tutorial with id ${id} not found`);
    }

    return tutorial;
  }
}
