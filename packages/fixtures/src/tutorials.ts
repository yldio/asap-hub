import { TutorialsResponse } from '@asap-hub/model';

type FixtureOptions = {
  key: string | number;
};

export const createTutorialsResponse = ({
  key,
}: FixtureOptions): TutorialsResponse => ({
  id: `uuid-${key}`,
  title: `${key} title`,
  shortText: `${key} short text`,
  text: `<h1>${key} text</h1>`,
  created: new Date().toISOString(),
});
