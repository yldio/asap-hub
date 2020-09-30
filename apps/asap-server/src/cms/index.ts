import Users from './users';
import ResearchOutputs from './research-outputs';

import { cms } from '../config';

export class CMS {
  users: Users;

  researchOutputs: ResearchOutputs;

  constructor() {
    this.users = new Users(cms);
    this.researchOutputs = new ResearchOutputs(cms);
  }
}
