import Joi from '@hapi/joi';
import { TeamTool } from '@asap-hub/model';

export const teamUpdateSchema = Joi.object({
  tools: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required(),
        description: Joi.string().required(),
        name: Joi.string().required(),
      }),
    )
    .required(),
})
  .min(1)
  .required();

export interface CMSGraphQLTeam {
  id: string;
  created: string;
  lastModified: string;
  flatData: {
    displayName: string;
    applicationNumber: string;
    projectTitle: string;
    projectSummary?: string;
    proposal?: { id: string }[] | null;
    skills: string[];
    tools?: TeamTool[];
  };
}
