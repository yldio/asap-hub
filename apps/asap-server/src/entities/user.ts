import Joi from '@hapi/joi';
import { OrcidWork, TeamMember } from '@asap-hub/model';

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
    biography?: { iv: string };
    location?: { iv: string };
    teams?: { iv: TeamMember[] };
    orcid?: { iv: string };
    orcidLastModifiedDate?: { iv: string };
    orcidWorks?: { iv: CMSOrcidWork[] };
    skills?: { iv: string[] };
    avatarURL?: { iv: string };
  };
}

export type CMSOrcidWork = OrcidWork;
export const createSchema = Joi.object({
  displayName: Joi.string().required(),
  email: Joi.string().required(),
  firstName: Joi.string(),
  middleName: Joi.string(),
  lastName: Joi.string(),
  title: Joi.string(),
  orcid: Joi.string(),
  biography: Joi.string(),
  institution: Joi.string(),
  connections: Joi.string(),
});
