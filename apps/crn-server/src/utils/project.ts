import { ProjectTool } from '@asap-hub/model';

export const getCleanProjectTools = (tools: ProjectTool[]): ProjectTool[] =>
  tools.map((tool) =>
    Object.entries(tool).reduce(
      (acc, [key, value]) =>
        value?.trim && value?.trim() === '' ? acc : { ...acc, [key]: value },
      {} as ProjectTool,
    ),
  );

export const haveSameIds = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;

  const aSorted = [...a].sort();
  const bSorted = [...b].sort();

  return aSorted.every((val, i) => val === bSorted[i]);
};
