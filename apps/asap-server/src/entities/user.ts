import Joi from '@hapi/joi';
import { TeamMember } from '@asap-hub/model';

export interface CMSUser {
  id: string;
  data: {
    displayName: { iv: string };
    email: { iv: string };
    firstName?: { iv: string };
    middleName?: { iv: string };
    lastName?: { iv: string };
    jobTitle?: { iv: string };
    institution?: { iv: string };
    connections: { iv: { code: string }[] };
    teams?: { iv: TeamMember[] };
    orcid?: { iv: string };
    orcidLastModifiedDate?: { iv: string };
    orcidWorks?: { iv: CMSOrcidWork[] };
  };
}

export interface CMSOrcidWork {
  id: string;
  doi?: string;
  title?: string;
  type: string;
  publicationDate: {
    year: string;
    month?: string;
    day?: string;
  };
  lastModifiedDate: string;
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
