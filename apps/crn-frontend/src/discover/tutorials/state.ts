import { GetListOptions } from '@asap-hub/frontend-utils';
import { ListTutorialsResponse, TutorialsResponse } from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilValue,
  useRecoilState,
} from 'recoil';
import { authorizationState } from '../../auth/state';
import { getTutorialById, getTutorials } from './api';

export const tutorialsIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'tutorialsIndex',
  default: undefined,
});

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

export const tutorialsListState = selectorFamily<
  ListTutorialsResponse | Error | undefined,
  GetListOptions
>({
  key: 'tutorialsList',
  get:
    (options) =>
    ({ get }) => {
      const index = get(tutorialsIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const tutorialsList = index.ids.reduce((acc: TutorialsResponse[], id) => {
        const tutorialItem = get(tutorialState(id));
        if (tutorialItem === undefined) {
          return acc;
        }
        return [...acc, tutorialItem];
      }, []);
      return { total: index.total, items: tutorialsList };
    },
  set:
    (options) =>
    ({ get, set, reset }, updatedTutorials) => {
      if (
        updatedTutorials === undefined ||
        updatedTutorials instanceof DefaultValue
      ) {
        const oldTutorials = get(tutorialsIndexState(options));
        if (!(oldTutorials instanceof Error)) {
          oldTutorials?.ids?.forEach((id) => reset(tutorialState(id)));
        }
        reset(tutorialsIndexState(options));
      } else if (updatedTutorials instanceof Error) {
        set(tutorialsIndexState(options), updatedTutorials);
      } else {
        updatedTutorials?.items.forEach((tutorial) =>
          set(tutorialState(tutorial.id), tutorial),
        );
        set(tutorialsIndexState(options), {
          total: updatedTutorials.total,
          ids: updatedTutorials.items.map((tutorial) => tutorial.id),
        });
      }
    },
});

export const useTutorials = (options: GetListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [tutorialsList, setTutorialsList] = useRecoilState(
    tutorialsListState(options),
  );
  if (tutorialsList === undefined) {
    throw getTutorials(options, authorization)
      .then(setTutorialsList)
      .catch(setTutorialsList);
  }
  if (tutorialsList instanceof Error) {
    throw tutorialsList;
  }
  return tutorialsList;
};

export const useTutorialById = (id: string) =>
  useRecoilValue(tutorialState(id));
