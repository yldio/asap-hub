import { ProjectTool } from '@asap-hub/model';

export const getCleanProjectTools = (tools: ProjectTool[]): ProjectTool[] =>
  tools.map((tool) =>
    Object.entries(tool).reduce(
      (acc, [key, value]) =>
        value?.trim && value?.trim() === '' ? acc : { ...acc, [key]: value },
      {} as ProjectTool,
    ),
  );
