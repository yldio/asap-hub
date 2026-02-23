import { TeamTool } from '@asap-hub/model';

// TODO: Remove this function once we have migrated all tools to projects
export const getCleanTools = (tools: TeamTool[]): TeamTool[] =>
  tools.map((tool) =>
    Object.entries(tool).reduce(
      (acc, [key, value]) =>
        value?.trim && value?.trim() === ''
          ? acc // deleted field
          : { ...acc, [key]: value },
      {} as TeamTool,
    ),
  );
