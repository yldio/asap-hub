import { TutorialsResponse } from '@asap-hub/model';
import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { authorizationState } from '../../auth/state';
import { getTutorialById } from './api';

export const refreshTutorialItemState = atomFamily<number, string>({
  key: 'refreshTutorialItem',
  default: 0,
});

export const fetchTutorialState = selectorFamily<
  TutorialsResponse | undefined,
  string
>({
  key: 'fetchTutorial',
  get:
    (id) =>
    ({ get }) => {
      get(refreshTutorialItemState(id));
      const authorization = get(authorizationState);
      return getTutorialById(id, authorization);
    },
});

const tutorialState = atomFamily<TutorialsResponse | undefined, string>({
  key: 'tutorial',
  default: fetchTutorialState,
});

export const useTutorialById = (id: string) =>
  useRecoilValue(tutorialState(id));
