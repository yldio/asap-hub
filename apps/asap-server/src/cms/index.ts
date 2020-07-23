import Users from './users';
import ResearchOutputs from './research-outputs';
import Teams from './teams';
import Content from './content';

import { cms } from '../config';

export class CMS {
  users: Users;

  researchOutputs: ResearchOutputs;

  teams: Teams;

  content: Content;

  constructor() {
    this.users = new Users(cms);
    this.researchOutputs = new ResearchOutputs(cms);
    this.teams = new Teams(cms);
    this.content = new Content(cms);
  }
}
