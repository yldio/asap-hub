import Joi from '@hapi/joi';
import { TeamMember } from '@asap-hub/model';

export interface CMSUser {
  id: string;
  data: {
    displayName: { iv: string };
    email: { iv: string };
    firstName: { iv: string };
    middleName: { iv: string };
    lastName: { iv: string };
    jobTitle: { iv: string };
    orcid: { iv: string };
    institution: { iv: string };
    connections: { iv: [{ code: string }] };
    teams: TeamMember[];
  };
}

export const createSchema = Joi.object({
  displayName: Joi.string().required(),
  email: Joi.string().required(),
  firstName: Joi.string(),
  middleName: Joi.string(),
  lastName: Joi.string(),
  title: Joi.string(),
  orcid: Joi.string(),
  institution: Joi.string(),
  connections: Joi.string(),
});
